import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password - Inventory System" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Confirm Password
                    </h1>

                    <p className="text-center text-sm text-gray-500 mt-2">
                        Inventory Management System Security Check
                    </p>

                    <p className="text-sm text-gray-600 mt-4 text-center">
                        This is a secure area. Please confirm your password before continuing.
                    </p>

                    <form onSubmit={submit} className="mt-6">

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm text-gray-600">
                                Password
                            </label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full mt-1 border rounded-lg p-2"
                            />

                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            disabled={processing}
                            className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Confirm Password
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}