import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - Inventory System" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Forgot Password
                    </h1>

                    <p className="text-center text-sm text-gray-500 mt-2">
                        Inventory Management System
                    </p>

                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Enter your email and we will send you a password reset link.
                    </p>

                    {/* STATUS MESSAGE */}
                    {status && (
                        <div className="mt-4 text-green-600 text-sm text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-6 space-y-4">

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm text-gray-600">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full mt-1 border rounded-lg p-2"
                            />

                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Send Reset Link
                        </button>

                    </form>

                </div>
            </div>
        </>
    );
}