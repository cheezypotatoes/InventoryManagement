import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function EditUser({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        is_locked: user.is_locked,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.users.update', user.id));
    };

    return (
        <>
            <Head title="Edit User" />

            <AdminLayout header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                    <Link href={route('admin.users.index')}>
                        <SecondaryButton>Back to Users</SecondaryButton>
                    </Link>
                </div>
            }>
                <div className="mx-auto max-w-2xl py-6 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role" />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <InputLabel htmlFor="is_active" value="Active" className="ml-2" />
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="is_locked"
                                    name="is_locked"
                                    checked={data.is_locked}
                                    onChange={(e) => setData('is_locked', e.target.checked)}
                                />
                                <InputLabel htmlFor="is_locked" value="Locked" className="ml-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <Link href={route('admin.users.index')}>
                                    <SecondaryButton className="mr-3">Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update User
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
