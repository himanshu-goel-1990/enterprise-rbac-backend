const {
  AbilityBuilder,
  createMongoAbility,
} = require("@casl/ability");

const defineAbilitiesFor = (user) => {
  const { can, build } =
    new AbilityBuilder(createMongoAbility);

  if (!user?.userRolesAssignments?.length) {
    return build();
  }

  for (const userRole of user.userRolesAssignments) {
    const permissions =
      userRole.role.rolePermissions;

    for (const rp of permissions) {
      can(
        rp.permission.action.toLowerCase(),
        rp.permission.subject
      );
    }
  }

  return build();
};

module.exports = defineAbilitiesFor;