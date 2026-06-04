const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const {
  createOrganization,

} = require("../repositories/auth.repository");

const {
  assignToRoleService,
  assignToUserService,
  deleteToRoleService,
  deleteToUserService
} = require("../services/policy.service");


// list all policies
const listPolicyController = asyncHandler(async (req, res) => {
  const policies = await prisma.policy.findMany();
  res.status(201).json({
    success: true,
    data: policies,
  });
});

// create new policy
const createPolicyController = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  //   // check if user exist
  //   const existingUser = await findUserByEmail(email);
  //   if (existingUser) {
  //     throw new ApiError(409, "Email already exists");
  //   }
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  // check if policy exist
  const policyExist = await prisma.policy.findFirst({
    where: {
      slug,
    },
  });
  if (policyExist) {
    throw new ApiError(409, "Policy already exists");
  }

  // create org
  let organization = [];
  if (!organizationExist) {
    organization = await createOrganization({
      name,
      slug,
      status,
    });
  }

  //   // generate pass hash
  //   const hashedPassword = await hashPassword(
  //     ownerPassword
  //   );
  //   // create user
  //   const user = await prisma.user.create({
  //     organizationId: organizationExist ? organizationExist.id : organization.id,
  //     name: name,
  //     email: ownerEmail,
  //     password: hashedPassword,
  //   });

  res.status(201).json({
    success: true,
    message: "Organization is added successfully",
  });
});

const editPolicyController = async (req, res) => {
  const { policyId } = req.params;

  const result = await prisma.policy.findFirst({
    where: {
      id: policyId,
    },
  });

  if (!result) {
    res.status(403).json({
      success: false,
      message: "Policy not found",
    });
  }

  res.status(201).json({
    success: true,
    data: result,
  });
};

const updatePolicyController = async (req, res) => {
  const { policyId } = req.params;
  const { name, description, status } = req.body;

  const result = await prisma.policy.findFirst({
    where: {
      id: policyId,
    },
  });

    const slug = name.toLowerCase().replace(/\s+/g, "-");


  if (!result) {
    res.status(403).json({
      success: false,
      message: "Policy not found",
    });
  }

  await prisma.policy.update({
    where: {
      id: policyId,
    },
    data: {
      name: name,
      description: description,
      slug,
      status: status,
    },
  });

  res.status(201).json({
    success: true,
    message: "Policy is updated successfully",
  });
};

const deletePolicyController = async (req, res) => {
  const { policyId } = req.params;

  const result = await prisma.policy.findFirst({
    where: {
      id: policyId,
    },
  });

  if (!result) {
    res.status(403).json({
      success: false,
      message: "Policy not found",
    });
  }

  await prisma.policy.delete({
    where: {
      id: policyId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Policy is deleted successfully",
  });
};

const assignRolePolicyController = asyncHandler(async (req, res) => {
  const result = await assignToRoleService(req.auth.org_id, req.body.role_id, req.body.policy_id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const assignUserPolicyController = asyncHandler(async (req, res) => {
  const result = await assignToUserService(req.auth.org_id, req.body.user_id, req.body.policy_id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const deleteRolePolicyController = asyncHandler(async (req, res) => {
  const result = await deleteToRoleService(req.params.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const deleteUserPolicyController = asyncHandler(async (req, res) => {
  const result = await deleteToUserService(req.params.policy_id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  listPolicyController,
  createPolicyController,
  editPolicyController,
  updatePolicyController,
  deletePolicyController,
  assignRolePolicyController,
  assignUserPolicyController,
  deleteRolePolicyController,
  deleteUserPolicyController
};
