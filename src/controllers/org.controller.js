const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const {
  createOrganization,
  findOrganizationBySlug,
  findUserByEmail,
  createUser,
  createRefreshToken,
} = require("../repositories/auth.repository");


// list all organizations
const listOrganization = asyncHandler(async (req, res) => {
  const orgs = await prisma.organization.findMany();
  res.status(201).json({
    success: true,
    data: orgs,
  });
});

// create new organization
const createNewOrganization = asyncHandler(async (req, res) => {
  const { name, slug, display_name, domain, domain_verified, status, metadata, settings } = req.body;

  //   // check if user exist
  //   const existingUser = await findUserByEmail(email);
  //   if (existingUser) {
  //     throw new ApiError(409, "Email already exists");
  //   }

  // check if org exist
  const organizationExist = await findOrganizationBySlug(slug);
  if (organizationExist) {
    throw new ApiError(409, "Organization already exists");
  }

  // create org
  let organization = [];
  if (!organizationExist) {
    organization = await createOrganization({
      name,
      display_name,
      domain,
      domain_verified,
      slug,
      status,
      metadata,
      settings: settings || {
        theme: "light",
      },
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

const editOrganization = async (req, res) => {
  const { orgId } = req.params;

  const result = await prisma.organization.findFirst({
    where: {
      id: orgId,
    },
  });

  if (!result) {
    res.status(403).json({
      success: false,
      message: "Organization not found",
    });
  }

  res.status(201).json({
    success: true,
    data: result,
  });
};

const updateOrganization = async (req, res) => {
  const { orgId } = req.params;
  const { name, slug, display_name, domain, domain_verified, status, metadata, settings } = req.body;

  const result = await prisma.organization.findFirst({
    where: {
      id: orgId,
    },
  });


  if (!result) {
    res.status(403).json({
      success: false,
      message: "Organization not found",
    });
  }

  await prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      name,
      slug,
      display_name,
      domain,
      domain_verified,
      slug,
      status,
      metadata,
      settings
    },
  });

  res.status(201).json({
    success: true,
    message: "Organization is updated successfully",
  });
};

const deleteOrganization = async (req, res) => {
  const { orgId } = req.params;

  const result = await prisma.organization.findFirst({
    where: {
      id: orgId,
    },
  });

  if (!result) {
    res.status(403).json({
      success: false,
      message: "Organization not found",
    });
  }

  await prisma.organization.delete({
    where: {
      id: orgId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Organization is deleted successfully",
  });
};

module.exports = {
  listOrganization,
  createNewOrganization,
  editOrganization,
  updateOrganization,
  deleteOrganization,
};
