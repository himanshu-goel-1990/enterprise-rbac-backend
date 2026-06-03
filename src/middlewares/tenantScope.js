
const applyTenantScope = (where = {}, req) => {
    const scope = req.auth?.scope;

    if (scope === 'global') {
        return where;
    }

    return {
        ...where,
        org_id: req.auth.org_id,
    };
};

module.exports = {
    applyTenantScope,
};