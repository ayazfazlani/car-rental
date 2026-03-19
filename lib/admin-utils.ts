import { UserRole } from "@prisma/client";

/**
 * Check if user has SUPER_ADMIN role
 */
export function isSuperAdmin(role: UserRole): boolean {
    return role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user has ADMIN or SUPER_ADMIN role
 */
export function isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user has permission to manage other admins (only SUPER_ADMIN)
 */
export function canManageAdmins(role: UserRole): boolean {
    return isSuperAdmin(role);
}

/**
 * Check if user can perform admin actions
 */
export function canPerformAdminAction(role: UserRole): boolean {
    return isAdmin(role);
}

/**
 * Get permission description based on role
 */
export function getRoleDescription(role: UserRole): string {
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return "Super Administrator - Full access to all admin features";
        case UserRole.ADMIN:
            return "Administrator - Access to manage cars, contacts, and other content";
        case UserRole.CUSTOMER:
            return "Customer Account";
        default:
            return "Unknown Role";
    }
}
