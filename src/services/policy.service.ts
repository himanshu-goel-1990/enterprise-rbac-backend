const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const assignToRoleService = async (
    org_id,
    role_id,
    policy_id
) => {
    return prisma.policyAssignment.create({
        data: {
            org_id,
            role_id,
            policy_id
        }
    });
};

const assignToUserService = async (
    org_id,
    role_id,
    policy_id
) => {
    return prisma.policyAssignment.create({
        data: {
            org_id,
            role_id,
            policy_id
        }
    });
};


module.exports = {
    assignToUserService,
    assignToRoleService,
};
