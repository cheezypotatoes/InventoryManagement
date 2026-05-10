import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function InventoryIndex({ inventory, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        status: filters.status || '',
    });

    const submit = (e) => {
        e.preventDefault();
        get(route('admin.inventory.index'), {
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Inventory Management" />

            <AdminLayout header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
                    <Link href={route('admin.inventory.create')}>
                        <PrimaryButton>Add Item</PrimaryButton>
                    </Link>
                </div>
            }>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6 p-6">
                        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <TextInput
                                    type="text"
                                    placeholder="Search by name, SKU, or category..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="sm:w-48">
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="discontinued">Discontinued</option>
                                </select>
                            </div>
                            <PrimaryButton type="submit">Search</PrimaryButton>
                        </form>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inventory.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                                No inventory items found.
                                            </td>
                                        </tr>
                                    ) : inventory.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.quantity}</div>
                                                <div className="text-xs text-gray-500">
                                                    Min: {item.min_stock_level}
                                                    {item.max_stock_level && ` / Max: ${item.max_stock_level}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link href={route('admin.inventory.show', item.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    View
                                                </Link>
                                                <Link href={route('admin.inventory.edit', item.id)} className="text-indigo-600 hover:text-indigo-900">
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {inventory.links && inventory.total > 0 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {inventory.from} to {inventory.to} of {inventory.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {inventory.links.map((link, index) => {
                                            // Skip links with no label (shouldn't happen but guard anyway)
                                            if (!link.label) return null;

                                            // Disabled link (null URL = first prev or last next)
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