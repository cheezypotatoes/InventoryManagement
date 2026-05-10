import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const ACTION_STYLES = {
    login:   'bg-green-100 text-green-800',
    logout:  'bg-gray-100 text-gray-800',
    create:  'bg-blue-100 text-blue-800',
    update:  'bg-yellow-100 text-yellow-800',
    delete:  'bg-red-100 text-red-800',
    view:    'bg-indigo-100 text-indigo-800',
    export:  'bg-purple-100 text-purple-800',
};

export default function ActivityLogsIndex({ logs, filters }) {
    const { data, setData, get } = useForm({
        user:      filters.user      || '',
        action:    filters.action    || '',
        date_from: filters.date_from || '',
        date_to:   filters.date_to   || '',
    });

    const submit = (e) => {
        e.preventDefault();
        get(route('admin.activity-logs.index'), { preserveState: true });
    };

    // Fix: bypass stale setData state by navigating directly with empty params
    const clearFilters = () => {
        router.get(route('admin.activity-logs.index'), {}, { preserveState: false });
    };

    return (
        <>
            <Head title="Activity Logs" />

            <AdminLayout header={<h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>}>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6 p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                                        User
                                    </label>
                                    <TextInput
                                        id="user"
                                        type="text"
                                        value={data.user}
                                        onChange={(e) => setData('user', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Search by user name..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                                        Action
                                    </label>
                                    <select
                                        id="action"
                                        value={data.action}
                                        onChange={(e) => setData('action', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All Actions</option>
                                        <option value="login">Login</option>
                                        <option value="logout">Logout</option>
                                        <option value="create">Create</option>
                                        <option value="update">Update</option>
                                        <option value="delete">Delete</option>
                                        <option value="view">View</option>
                                        <option value="export">Export</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date_from"
                                        value={data.date_from}
                                        max={data.date_to || undefined}
                                        onChange={(e) => setData('date_from', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date_to"
                                        value={data.date_to}
                                        min={data.date_from || undefined}
                                        onChange={(e) => setData('date_to', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <PrimaryButton type="submit">Filter</PrimaryButton>
                                <SecondaryButton type="button" onClick={clearFilters}>
                                    Clear Filters
                                </SecondaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Activity Logs Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                                No activity logs found.
                                            </td>
                                        </tr>
                                    ) : logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {log.user?.name || 'System'}
                                                </div>
                                                <div className="text-sm text-gray-500">{log.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${ACTION_STYLES[log.action] ?? 'bg-gray-100 text-gray-800'}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate" title={log.description}>
                                                    {log.description}
                                                </div>
                                                {log.model_type && (
                                                    <div className="text-xs text-gray-500">
                                                        {log.model_type} #{log.model_id}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {log.ip_address}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={route('admin.activity-logs.show', log.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {logs.links && logs.total > 0 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {logs.from} to {logs.to} of {logs.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {logs.links.map((link, index) => {
                                            if (!link.label) return null;

                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-2 text-sm border rounded bg-white text-gray-400 border-gray-200 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm border rounded ${
                                                        link.active
                                                            ? 'bg-indigo-500 text-white border-indigo-500'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}