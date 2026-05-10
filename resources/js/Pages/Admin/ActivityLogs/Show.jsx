import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ShowActivityLog({ log }) {
    return (
        <>
            <Head title="Activity Log Details" />

            <AdminLayout header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Activity Log Details</h2>
                    <Link href={route('admin.activity-logs.index')}>
                        <SecondaryButton>Back to Activity Logs</SecondaryButton>
                    </Link>
                </div>
            }>
                <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Log Entry #{log.id}</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(log.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div className="px-6 py-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">User</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {log.user ? (
                                            <div>
                                                <div className="font-medium">{log.user.name}</div>
                                                <div className="text-gray-500">{log.user.email}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">System</span>
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Action</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            log.action === 'login' ? 'bg-green-100 text-green-800' :
                                            log.action === 'logout' ? 'bg-gray-100 text-gray-800' :
                                            log.action === 'create' ? 'bg-blue-100 text-blue-800' :
                                            log.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                                            log.action === 'delete' ? 'bg-red-100 text-red-800' :
                                            log.action === 'view' ? 'bg-indigo-100 text-indigo-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{log.ip_address}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">User Agent</dt>
                                    <dd className="mt-1 text-sm text-gray-900 max-w-xs break-words">
                                        {log.user_agent || 'Not available'}
                                    </dd>
                                </div>

                                {log.model_type && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Related Model</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {log.model_type} #{log.model_id}
                                        </dd>
                                    </div>
                                )}

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(log.created_at).toLocaleString()}
                                    </dd>
                                </div>

                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {log.description}
                                    </dd>
                                </div>

                                {log.old_values && Object.keys(log.old_values).length > 0 && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Previous Values</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <pre className="bg-red-50 p-3 rounded-md text-xs overflow-x-auto">
                                                {JSON.stringify(log.old_values, null, 2)}
                                            </pre>
                                        </dd>
                                    </div>
                                )}

                                {log.new_values && Object.keys(log.new_values).length > 0 && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">New Values</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <pre className="bg-green-50 p-3 rounded-md text-xs overflow-x-auto">
                                                {JSON.stringify(log.new_values, null, 2)}
                                            </pre>
                                        </dd>
                                    </div>
                                )}

                                {log.metadata && Object.keys(log.metadata).length > 0 && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Additional Metadata</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <pre className="bg-blue-50 p-3 rounded-md text-xs overflow-x-auto">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
