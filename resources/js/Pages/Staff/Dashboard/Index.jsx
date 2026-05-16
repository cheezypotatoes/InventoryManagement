import StaffLayout from '@/Layouts/Staff/StaffLayout';
import { Head, Link } from '@inertiajs/react';

export default function StaffDashboard({ auth, stats = {}, recent_activity = [] }) {
    const {
        total_inventory = 0,
        low_stock       = 0,
        total_value     = 0,
    } = stats;

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val ?? 0);

    return (
        <>
            <Head title="Staff Dashboard" />

            <StaffLayout header={<h2 className="text-xl font-semibold text-gray-900">Staff Dashboard</h2>}>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 space-y-6">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">Total Inventory</span>
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{Number(total_inventory).toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Items in stock</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">Low Stock</span>
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{Number(low_stock).toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Below minimum level</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">Total Value</span>
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(total_value)}</p>
                            <p className="text-xs text-gray-400 mt-1">Inventory value</p>
                        </div>

                    </div>

                    {/* Low Stock Alert */}
                    {low_stock > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-yellow-800">
                                    <strong>{low_stock}</strong> item{low_stock !== 1 ? 's are' : ' is'} below minimum stock level.
                                </p>
                            </div>
                            <Link href={route('staff.inventory.index')} className="text-sm font-medium text-yellow-700 hover:text-yellow-900 underline ml-4 whitespace-nowrap">
                                View Items →
                            </Link>
                        </div>
                    )}

                    {/* Quick Link - Inventory only */}
                    <div>
                        <Link href={route('staff.inventory.index')} className="bg-white rounded-lg shadow p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Inventory</span>
                                <p className="text-xs text-gray-400">Browse and manage stock items</p>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                        </div>

                        {recent_activity.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {recent_activity.map((activity) => (
                                    <div key={activity.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-indigo-700">
                                                    {(activity.user?.name ?? 'S')[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.user?.name ?? 'System'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    <span className="capitalize">{activity.action}</span>
                                                    {activity.entity_type ? ` · ${activity.entity_type}` : ''}
                                                    {(activity.details?.name || activity.details?.email)
                                                        ? ` · ${activity.details.name ?? activity.details.email}`
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4 flex-shrink-0">
                                            {new Date(activity.created_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-sm text-gray-400">No recent activity yet.</p>
                            </div>
                        )}
                    </div>

                </div>
            </StaffLayout>
        </>
    );
}