import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuditService {
  async log(data: {
    org_id?: string;
    actorUserId?: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: any;
  }) {
    return prisma.auditLog.create({
      data: {
        org_id: data.org_id,
        actor_user_id: data.actorUserId,
        event_type: "authorization",
        action: data.action,
        resource_type: data.resourceType,
        resource_id: data.resourceId,
        metadata: data.metadata || {},
      },
    });
  }
}

export const auditService =
  new AuditService();