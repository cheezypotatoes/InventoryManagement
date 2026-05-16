import StaffLayout from '@/Layouts/Staff/StaffLayout';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function EditInventory({ inventory }) {
    const { data, setData, put, processing, errors } = useForm({
        name: inventory.name || '',
        description: inventory.description || '',
        sku: inventory.sku || '',
        category: inventory.category || '',
        quantity: inventory.quantity || '',
        unit_price: inventory.unit_price || '',
        min_stock_level: inventory.min_stock_level || '',
        max_stock_level: inventory.max_stock_level || '',
        location: inventory.location || '',
        supplier: inventory.supplier || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.inventory.update', inventory.id));
    };

    return (
        <>
            <Head title="Edit Inventory Item" />

            <StaffLayout header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Inventory Item</h2>
                    <SecondaryButton onClick={() => window.history.back()}>
                        Cancel
                    </SecondaryButton>
                </div>
            }>
                <div className="mx-auto max-w-2xl py-6 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <TextInput
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* SKU and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                                    <TextInput
                                        type="text"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.sku} className="mt-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <TextInput
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.category} className="mt-2" />
                                </div>
                            </div>

                            {/* Quantity and Unit Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.quantity} className="mt-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit Price ($)</label>
                                    <TextInput
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.unit_price}
                                        onChange={(e) => setData('unit_price', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.unit_price} className="mt-2" />
                                </div>
                            </div>

                            {/* Stock Levels */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={data.min_stock_level}
                                        onChange={(e) => setData('min_stock_level', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.min_stock_level} className="mt-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Stock Level</label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={data.max_stock_level}
                                        onChange={(e) => setData('max_stock_level', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.max_stock_level} className="mt-2" />
                                </div>
                            </div>

                            {/* Location and Supplier */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <TextInput
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Supplier</label>
                                    <TextInput
                                        type="text"
                                        value={data.supplier}
                                        onChange={(e) => setData('supplier', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.supplier} className="mt-2" />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end space-x-3">
                                <SecondaryButton type="button" onClick={() => window.history.back()}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Item'}
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </StaffLayout>
        </>
    );
}