export interface ParsedArn {
  raw: string;

  partition: string;

  service: string;

  tenant: string;

  resource: string;
}