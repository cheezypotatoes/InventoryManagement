import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ShowInventory({ inventory }) {
    return (
        <>
            <Head title="Inventory Details" />

            <AdminLayout header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Inventory Details</h2>
                    <div className="flex space-x-3">
                        <Link href={route('admin.inventory.edit', inventory.id)}>
                            <SecondaryButton>Edit</SecondaryButton>
                        </Link>
                        <SecondaryButton onClick={() => window.history.back()}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }>
                <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">{inventory.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {inventory.sku}</p>
                        </div>

                        <div className="px-6 py-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {inventory.description || 'No description provided'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.category}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.quantity}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Unit Price</dt>
                                    <dd className="mt-1 text-sm text-gray-900">${inventory.unit_price}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total Value</dt>
                                    <dd className="mt-1 text-sm text-gray-900">${inventory.total_value}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Stock Levels</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        Min: {inventory.min_stock_level}
                                        {inventory.max_stock_level && ` / Max: ${inventory.max_stock_level}`}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {inventory.location || 'Not specified'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {inventory.supplier || 'Not specified'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            inventory.status === 'active' ? 'bg-green-100 text-green-800' :
                                            inventory.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {inventory.status}
                                        </span>
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {inventory.creator?.name || 'System'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(inventory.updated_at).toLocaleString()}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Updated By</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {inventory.updater?.name || 'System'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
