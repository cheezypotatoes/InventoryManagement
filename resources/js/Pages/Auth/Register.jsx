import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Register - Inventory System" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Account
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Inventory Management System
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-4">

                        {/* NAME */}
                        <div>
                            <label className="text-sm text-gray-600">Full Name</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="text-sm text-gray-600">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {processing ? 'Creating account...' : 'Register'}
                        </button>

                    </form>

                    {/* FOOTER */}
                    <div className="text-center mt-6 text-sm">
                        <Link
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Already have an account? Login
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}