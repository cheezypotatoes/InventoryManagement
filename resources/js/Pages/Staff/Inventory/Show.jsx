import StaffLayout from '@/Layouts/Staff/StaffLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function ShowInventory({ inventory, changeRequests = [] }) {
    const [showRequestForm, setShowRequestForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
        changes: {
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
        },
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.change-requests.store', inventory.id), {
            preserveState: false,
        });
    };

    const statusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <>
            <Head title="Inventory Details" />

            <StaffLayout header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Inventory Details</h2>
                    <div className="flex space-x-3">
                        <PrimaryButton onClick={() => setShowRequestForm(!showRequestForm)}>
                            {showRequestForm ? 'Cancel Request' : 'Request Change'}
                        </PrimaryButton>
                        <SecondaryButton onClick={() => window.history.back()}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }>
                <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8 space-y-6">

                    {/* Inventory Details */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">{inventory.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {inventory.sku}</p>
                        </div>

                        <div className="px-6 py-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.description || 'No description provided'}</dd>
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
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.location || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.supplier || 'Not specified'}</dd>
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
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.creator?.name || 'System'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{new Date(inventory.updated_at).toLocaleString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Updated By</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{inventory.updater?.name || 'System'}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Change Request Form */}
                    {showRequestForm && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900">Submit Change Request</h3>
                                <p className="text-sm text-gray-500 mt-1">Fill in the fields you want to change. Admin will review your request.</p>
                            </div>

                            <form onSubmit={submit} className="px-6 py-6 space-y-6">
                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Reason for Change <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        rows={3}
                                        placeholder="Explain why you are requesting this change..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    <InputError message={errors.reason} className="mt-2" />
                                </div>

                                {/* Name and SKU */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <TextInput
                                            type="text"
                                            value={data.changes.name}
                                            onChange={(e) => setData('changes', { ...data.changes, name: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.name']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                                        <TextInput
                                            type="text"
                                            value={data.changes.sku}
                                            onChange={(e) => setData('changes', { ...data.changes, sku: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.sku']} className="mt-2" />
                                    </div>
                                </div>

                                {/* Category and Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <TextInput
                                            type="text"
                                            value={data.changes.category}
                                            onChange={(e) => setData('changes', { ...data.changes, category: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.category']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <TextInput
                                            type="text"
                                            value={data.changes.location}
                                            onChange={(e) => setData('changes', { ...data.changes, location: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.location']} className="mt-2" />
                                    </div>
                                </div>

                                {/* Quantity and Unit Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            value={data.changes.quantity}
                                            onChange={(e) => setData('changes', { ...data.changes, quantity: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.quantity']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Unit Price ($)</label>
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.changes.unit_price}
                                            onChange={(e) => setData('changes', { ...data.changes, unit_price: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.unit_price']} className="mt-2" />
                                    </div>
                                </div>

                                {/* Stock Levels */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            value={data.changes.min_stock_level}
                                            onChange={(e) => setData('changes', { ...data.changes, min_stock_level: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.min_stock_level']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Stock Level</label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            value={data.changes.max_stock_level}
                                            onChange={(e) => setData('changes', { ...data.changes, max_stock_level: e.target.value })}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors['changes.max_stock_level']} className="mt-2" />
                                    </div>
                                </div>

                                {/* Supplier */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Supplier</label>
                                    <TextInput
                                        type="text"
                                        value={data.changes.supplier}
                                        onChange={(e) => setData('changes', { ...data.changes, supplier: e.target.value })}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors['changes.supplier']} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={data.changes.description}
                                        onChange={(e) => setData('changes', { ...data.changes, description: e.target.value })}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors['changes.description']} className="mt-2" />
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end space-x-3">
                                    <SecondaryButton type="button" onClick={() => setShowRequestForm(false)}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {processing ? 'Submitting...' : 'Submit Request'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Change Requests List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">Change Request History</h3>
                        </div>

                        {changeRequests.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                                <p className="text-sm text-gray-400">No change requests for this item yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {changeRequests.map((req) => (
                                    <div key={req.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                {statusBadge(req.status)}
                                                <span className="text-xs text-gray-400">
                                                    {new Date(req.created_at).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            {req.reviewer && (
                                                <span className="text-xs text-gray-400">
                                                    Reviewed by {req.reviewer.name}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-700 mb-2">
                                            <span className="font-medium">Reason:</span> {req.reason}
                                        </p>

                                        {req.review_note && (
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Admin note:</span> {req.review_note}
                                            </p>
                                        )}

                                        {/* Requested Changes */}
                                        <div className="mt-3 bg-gray-50 rounded-md p-3">
                                            <p className="text-xs font-medium text-gray-500 mb-2">Requested Changes:</p>
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                {Object.entries(req.changes).map(([key, value]) => (
                                                    value !== '' && value !== null && (
                                                        <div key={key} className="flex gap-2 text-xs">
                                                            <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                            <span className="text-gray-900">{value}</span>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </StaffLayout>
        </>
    );
}