export const getUserRole = (user) => String(user?.role?.name ?? user?.role ?? "").toUpperCase();

export const getUserPermissions = (user) => {
    const permissions = user?.permissions ?? user?.role?.permissions ?? user?.rolePermissions ?? [];
    if (!Array.isArray(permissions)) return [];
    return permissions.map((permission) => String(permission?.key ?? permission?.name ?? permission).toUpperCase());
};
