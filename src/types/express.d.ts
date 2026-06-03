export interface AuthUser {
  user_id: string;
  org_id: string;
  session_id: string;
  permissions: string[];
  workspace_id?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}