import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login({ status }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Inventory Login" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Inventory System
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Sign in to manage products, stock & sales
                        </p>
                    </div>

                    {/* STATUS */}
                    {status && (
                        <div className="mb-4 text-sm text-green-600 text-center">
                            {status}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-4">

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <input
                                type="email"
                                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="admin@inventory.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm text-gray-600">Password</label>
                            <input
                                type="password"
                                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* REMEMBER + FORGOT */}
                        <div className="flex justify-start items-center text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                Remember me
                            </label>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>

                    </form>

                    {/* FOOTER */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Inventory Management System © {new Date().getFullYear()}
                    </p>

                </div>
            </div>
        </>
    );
}