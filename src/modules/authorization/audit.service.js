const prisma = require("../../config/prisma");

class AuditService {
  static async log({
    org_id,
    user_id,
    action,
    resource,
    allowed,
    policyId,
    reason,
  }) {
    try {
      await prisma.authorizationAuditLog.create({
        data: {
          org_id,
          user_id,
          action,
          resource,
          allowed,
          policyId,
          reason,
        },
      });
    } catch (err) {
      console.error(
        "Authorization audit failed",
        err
      );
    }
  }
}

module.exports = AuditService;