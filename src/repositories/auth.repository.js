const prisma = require("../config/prisma");

const createOrganization = async (data) => {
  return prisma.organization.create({
    data,
  });
};

const findOrganizationBySlug = async (slug) => {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

const createRefreshToken = async (data) => {
  return prisma.refreshToken.create({
    data,
  });
};

module.exports = {
  createOrganization,
  findOrganizationBySlug,
  findUserByEmail,
  createUser,
  createRefreshToken,
};