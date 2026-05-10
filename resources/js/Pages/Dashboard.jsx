import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const user = auth.user;
    const role = user?.role ?? 'staff';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Welcome card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <p className="text-lg font-medium">
                                Welcome back,{' '}
                                <span className="text-blue-600">{user.name}</span> 👋
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Signed in as{' '}
                                <span className="font-semibold capitalize text-blue-600">
                                    {role}
                                </span>
                                .{role === 'admin'   && ' You have full system access.'}
                                {role === 'manager' && ' You can manage stock, sales, and reports.'}
                                {role === 'staff'   && ' You can view products and record sales.'}
                            </p>
                        </div>
                    </div>

                    {/* Role-gated stat cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">

                        {/* All roles */}
                        <StatCard icon="📦" label="Total Products" color="blue" />
                        <StatCard icon="🧾" label="Today's Sales"  color="green" />

                        {/* Manager + Admin */}
                        {['admin', 'manager'].includes(role) && (
                            <StatCard icon="🚚" label="Pending Purchases" color="yellow" />
                        )}

                        {/* Admin only */}
                        {role === 'admin' && (
                            <StatCard icon="👥" label="Total Users" color="red" />
                        )}
                    </div>

                    {/* Quick actions */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-base font-semibold text-gray-700">
                                Quick Actions
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <div className="text-sm text-gray-500 italic">
                                    Inventory management features coming soon...
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ── Sub-components ── */

const COLOR_MAP = {
    blue:   'bg-blue-50 border-blue-100 text-blue-600',
    green:  'bg-green-50 border-green-100 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-100 text-yellow-600',
    red:    'bg-red-50 border-red-100 text-red-600',
};

function StatCard({ icon, label, color }) {
    return (
        <div className={`rounded-xl border p-5 shadow-sm ${COLOR_MAP[color]}`}>
            <div className="mb-2 text-3xl">{icon}</div>
            <p className="text-sm font-medium opacity-70">{label}</p>
            <p className="mt-1 text-2xl font-bold">—</p>
        </div>
    );
}