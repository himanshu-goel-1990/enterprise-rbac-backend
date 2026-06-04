import { PrismaClient, RoleScope } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedPolicy() {
    console.log("🌱 Seeding policy for super admin...");

    await prisma.policy.create({
        data: {
            name: "Super Admin",

            slug: "super-admin",

            actions: ["*"],

            resources: [
                "arn:aeos:*:*:*"
            ],

            priority: 1,

            policy_document: '{"Version":"2024-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"arn:aeos:*:*:*"}]}',  

            effect_default: 'allow',

            scope: "global"
        },
        
    });

    await prisma.policy.create({
        data: 
        {
            name: "Tenant Admin",

            slug: "tenant-admin",

            actions: ["*"],

            resources: [
                "arn:aeos:*:*:*"
            ],

            priority: 1,

            policy_document: '{"Version":"2024-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"arn:aeos:*:*:*"}]}',  

            effect_default: 'allow',

            scope: "organization"
        }
    });

}