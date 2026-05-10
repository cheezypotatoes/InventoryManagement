import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

/**
 * Role-based navigation config.
 * Add / remove routes per role here.
 */
const NAV_LINKS = {
    admin: [
        { label: 'Dashboard',  href: 'admin.dashboard' },
        { label: 'Inventory',  href: 'admin.inventory.index' },
        { label: 'Users',      href: 'admin.users.index' },
        { label: 'Reports',    href: 'admin.reports.index' },
        { label: 'Security',   href: 'admin.security.index' },
        { label: 'Activity Logs', href: 'admin.activity-logs.index' },
        { label: 'Profile',    href: 'profile.edit' },
    ],
    manager: [
        { label: 'Dashboard',  href: 'dashboard' },
        { label: 'Profile',    href: 'profile.edit' },
    ],
    staff: [
        { label: 'Dashboard',  href: 'dashboard' },
        { label: 'Profile',    href: 'profile.edit' },
    ],
};

const ROLE_BADGE = {
    admin:   'bg-red-100 text-red-700',
    manager: 'bg-yellow-100 text-yellow-700',
    staff:   'bg-green-100 text-green-700',
};

/**
 * RoleNavLinks — desktop horizontal links (slot into the existing <nav> flex row).
 */
export function RoleNavLinks({ user }) {
    const role  = user?.role ?? 'staff';
    const links = NAV_LINKS[role] ?? NAV_LINKS.staff;

    return (
        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex items-center">
            {links.map(({ label, href }) => (
                <NavLink
                    key={href}
                    href={route(href)}
                    active={route().current(href)}
                >
                    {label}
                </NavLink>
            ))}
            {/* Role badge next to the links */}
            <span
                className={`ml-4 text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                    ROLE_BADGE[role] ?? 'bg-gray-100 text-gray-600'
                }`}
            >
                {role}
            </span>
        </div>
    );
}

/**
 * RoleResponsiveNavLinks — mobile stacked links (slot into the existing mobile drawer).
 */
export function RoleResponsiveNavLinks({ user }) {
    const role  = user?.role ?? 'staff';
    const links = NAV_LINKS[role] ?? NAV_LINKS.staff;

    return (
        <div className="space-y-1 pb-3 pt-2">
            {links.map(({ label, href }) => (
                <ResponsiveNavLink
                    key={href}
                    href={route(href)}
                    active={route().current(href)}
                >
                    {label}
                </ResponsiveNavLink>
            ))}
        </div>
    );
}