
const applyTenantScope = (where = {}, req) => {
    const scope = req.auth?.scope;

    if (req.auth.roles.includes('super_admin')) {
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