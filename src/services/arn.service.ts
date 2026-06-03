import { ParsedArn } from "../types/arn.types";

class ArnService {
  /**
   * Parse ARN string
   */
  parseArn(arn: string): ParsedArn {
    const parts = arn.split(":");

    if (parts.length !== 5) {
      throw new Error(`Invalid ARN: ${arn}`);
    }

    const [prefix, partition, service, tenant, resource] =
      parts;

    if (prefix !== "arn") {
      throw new Error(`Invalid ARN: ${arn}`);
    }

    return {
      raw: arn,
      partition,
      service,
      tenant,
      resource,
    };
  }

  /**
   * Validate ARN format
   */
  isValidArn(arn: string): boolean {
    try {
      this.parseArn(arn);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Exact match
   */
  exactMatch(
    policyArn: string,
    resourceArn: string
  ): boolean {
    return policyArn === resourceArn;
  }

  /**
   * Wildcard match
   */
  wildcardMatch(
    policyArn: string,
    resourceArn: string
  ): boolean {
    return micromatch.isMatch(
      resourceArn,
      policyArn
    );
  }

  /**
   * Main matcher
   */
  match(
    policyArn: string,
    resourceArn: string
  ): boolean {
    if (
      this.exactMatch(
        policyArn,
        resourceArn
      )
    ) {
      return true;
    }

    return this.wildcardMatch(
      policyArn,
      resourceArn
    );
  }
}

export const arnService = new ArnService();