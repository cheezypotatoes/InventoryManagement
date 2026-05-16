import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminDashboard({ auth, stats = {}, recent_activity = [], alerts = {}, stock_chart = [], pending_change_requests = [] }) {
    const {
        total_inventory = 0,
        low_stock       = 0,
        total_value     = 0,
        active_users    = 0,
        pending_change_requests: pendingCount = 0,
    } = stats;

    const [selectedRequest, setSelectedRequest] = useState(null);

    const { data, setData, patch, processing, reset } = useForm({
        review_note: '',
    });

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val ?? 0);

    const approve = () => {
        patch(route('admin.change-requests.approve', selectedRequest.id), {
            preserveState: false,
            onSuccess: () => {
                setSelectedRequest(null);
                reset();
            },
        });
    };

    const reject = () => {
        patch(route('admin.change-requests.reject', selectedRequest.id), {
            preserveState: false,
            onSuccess: () => {
                setSelectedRequest(null);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <AdminLayout header={<h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>}>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 space-y-6">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">Active Users</span>
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{Number(active_users).toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Registered users</p>
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
                            <Link href={route('admin.inventory.index')} className="text-sm font-medium text-yellow-700 hover:text-yellow-900 underline ml-4 whitespace-nowrap">
                                View Items →
                            </Link>
                        </div>
                    )}

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Link href={route('admin.inventory.index')} className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Inventory</span>
                        </Link>

                        <Link href={route('admin.users.index')} className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Users</span>
                        </Link>

                        <Link href={route('admin.reports.index')} className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Reports</span>
                        </Link>

                        <Link href={route('admin.activity-logs.index')} className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Activity Logs</span>
                        </Link>
                    </div>

                    {/* Pending Change Requests */}
                    {pending_change_requests.length > 0 && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-semibold text-gray-900">Pending Change Requests</h3>
                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                        {pendingCount}
                                    </span>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {pending_change_requests.map((req) => (
                                    <div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-yellow-700">
                                                    {(req.requester?.name ?? 'S')[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {req.requester?.name ?? 'Staff'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    Requested changes to <span className="font-medium">{req.inventory?.name ?? '—'}</span>
                                                    {req.inventory?.sku ? ` · ${req.inventory.sku}` : ''}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{req.reason}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(req.created_at).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </span>
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                                            >
                                                Review →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                            <Link href={route('admin.activity-logs.index')} className="text-sm text-indigo-600 hover:text-indigo-800">
                                View all →
                            </Link>
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
            </AdminLayout>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => { setSelectedRequest(null); reset(); }} />

                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Review Change Request</h3>
                            <button onClick={() => { setSelectedRequest(null); reset(); }} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-4 space-y-4">
                            {/* Request Info */}
                            <div className="bg-gray-50 rounded-md p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Requested by</span>
                                    <span className="font-medium text-gray-900">{selectedRequest.requester?.name ?? '—'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Item</span>
                                    <span className="font-medium text-gray-900">{selectedRequest.inventory?.name ?? '—'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">SKU</span>
                                    <span className="font-medium text-gray-900">{selectedRequest.inventory?.sku ?? '—'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Submitted</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(selectedRequest.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
                                <p className="text-sm text-gray-900 bg-gray-50 rounded-md p-3">{selectedRequest.reason}</p>
                            </div>

                            {/* Requested Changes */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Requested Changes</p>
                                <div className="bg-gray-50 rounded-md p-3 space-y-1">
                                    {Object.entries(selectedRequest.changes).map(([key, value]) =>
                                        value !== '' && value !== null ? (
                                            <div key={key} className="flex justify-between text-sm">
                                                <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                                <span className="font-medium text-gray-900">{value}</span>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>

                            {/* Review Note */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Review Note <span className="text-gray-400">(required for rejection)</span>
                                </label>
                                <textarea
                                    value={data.review_note}
                                    onChange={(e) => setData('review_note', e.target.value)}
                                    rows={3}
                                    placeholder="Add a note for the staff member..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => { setSelectedRequest(null); reset(); }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={reject}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                                onClick={approve}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}