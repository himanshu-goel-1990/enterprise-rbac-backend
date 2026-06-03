function buildArn({
  org_id,
  resourceType,
  resourceId,
}) {
  return `arn:aeos:${org_id}:${resourceType}:${resourceId}`;
}

module.exports = {
  buildArn,
};