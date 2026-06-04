const applyUserTenantScope = (where = {}, req) => {
    if (req.auth.roles.includes('super_admin')) {
        return where;
    }

    return {
        ...where,
        org_id: req.auth.org_id,
    };
};

const applyOrgTenantScope = (where = {}, req) => {
    if (req.auth.roles.includes('super_admin')) {
        return where;
    }

    return {
        ...where,
        id: req.auth.org_id,
    };
};

module.exports = {
    applyUserTenantScope,
    applyOrgTenantScope
};