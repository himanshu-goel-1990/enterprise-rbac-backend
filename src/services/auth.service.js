const {
  createOrganization,
  findOrganizationBySlug,
  findUserByEmail,
  createUser,
  createRefreshToken,
} = require("../repositories/auth.repository");

const { hashToken } = require("../utils/token");

const ApiError = require("../utils/apiError");

const prisma = require("../config/prisma");

const { hashPassword, comparePassword } = require("../utils/password");

const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const { permissionService } = require("./permission.service.js");

const register = async (payload) => {
  console.log(payload);
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  // const slug = payload.organizationName
  //   .toLowerCase()
  //   .replace(/\s+/g, "-");

  // const organizationExist = await findOrganizationBySlug(slug);
  // let organization = []
  // if(!organizationExist) {
  //   organization = await createOrganization({
  //     name: payload.organizationName,
  //     slug,
  //   });
  // }

  const hashedPassword = await hashPassword(payload.password);

  const user = await createUser({
    organization: {
      connect: {
        id: payload.org_id,
      },
    },
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    title: payload.jobTitle,
    password_hash: hashedPassword,
    is_active: true,
    is_email_verified: true,
    metadata: payload.metadata || {},
  });

  const jwtPayload = {
    user_id: user.id,
    org_id: payload.org_id,
    session_id: payload.sessionId,
    workspace_id: payload.workspaceId,
    permissions: payload.permissions,
  };

  const accessToken = generateAccessToken(jwtPayload);

  const refreshToken = generateRefreshToken(jwtPayload);

  await createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  delete user.password;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const login = async (req) => {
  const { email, password } = req.body;
  const { ip } = req;
  const user = await findUserByEmail(email);

  // check user exist
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // check if user is active
  if (!user.is_active) {
    throw new Error("Account is disabled");
  }

  // validate password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  // check if password is invalid, throw error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // resolve user permissions
  const permissions = await permissionService.resolveUserPermissions({
    userId: user.id,
    org_id: user.org_id,
  });

  const rolesData = await permissionService.getUserRoles({
    userId: user.id,
    org_id: user.org_id,
  });

  const roles = rolesData.map((a) => a.role.slug);

  

  const roleIds = rolesData.map((r) => r.role_id);


  // create token expiry date 7 days from now
  const TokenExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // create session
  const session = await prisma.session.create({
    data: {
      org_id: user.org_id,
      user_id: user.id,
      refresh_token_hash: "",
      user_agent: null,
      ip_address: req.ip,
      expires_at: TokenExpiryDate,
    },
  });

  // const policy =
  //   await prisma.policy.findFirst({
  //     where: {
  //       OR: [
  //         {
  //           org_id: user.org_id,
  //         }
  //       ],
  //       is_active: true,
  //     },
  //   });

  const userAssignments = await prisma.policyAssignment.findMany({
    where: {
      org_id: user.org_id,
      user_id: user.id,
    },
    include: {
      policy: true,
    },
  });

  const roleAssignments = await prisma.policyAssignment.findMany({
    where: {
      org_id: user.org_id,
      role_id: {
        in: roleIds,
      },
    },
    include: {
      policy: true,
    },
  });

  const policyMap = new Map();

  [
    ...userAssignments,
    ...roleAssignments,
  ].forEach((assignment) => {
    policyMap.set(
      assignment.policy.id,
      assignment.policy
    );
  });

  const policies = [...policyMap.values()];

  const jwtPolicies = policies.map((p) => ({
    id: p.id,
    name: p.name,
    effect_default: p.effect_default,
    actions: p.actions,
    resources: p.resources,
    conditions: p.conditions,
  }));

  const jwtPayload = {
    user_id: user.id,
    organization_id: user.org_id,
    session_id: session.id,
    roles,
    roleIds,
    permissions,
    policies: jwtPolicies,
  };

  // create access token
  const accessToken = generateAccessToken(jwtPayload);

  // create refresh token
  const refreshToken = generateRefreshToken(jwtPayload);

  // create hash refresh token
  const refreshTokenHash = hashToken(refreshToken);

  // update session with refresh token hash
  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      refresh_token_hash: refreshTokenHash,
    },
  });

  // store refresh token in database
  await createRefreshToken({
    session_id: session.id,
    token_hash: refreshTokenHash,
    expires_at: TokenExpiryDate,
  });

  // create audit log
  await prisma.auditLog.create({
    data: {
      org_id: user.org_id,
      actor_user_id: user.id,
      event_type: "auth",
      action: "login",
      resource_type: "user",
      resource_id: user.id,
      metadata: {
        email: user.email,
      },
    },
  });

  // remove password from user object before returning
  delete user.password;

  return {
    user,
    accessToken,
    refreshToken,
    permissions,
    roles,
  };
};

module.exports = {
  register,
  login,
};
