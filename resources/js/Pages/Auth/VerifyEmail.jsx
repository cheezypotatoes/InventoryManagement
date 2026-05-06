import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {

    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <>
            <Head title="Verify Email - Inventory System" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Verify Your Email
                    </h1>

                    <p className="text-gray-600 mt-3 text-sm">
                        Before accessing the Inventory System, please verify your email address.
                        If you didn’t receive the email, we can send it again.
                    </p>

                    {/* STATUS */}
                    {status === 'verification-link-sent' && (
                        <div className="mt-4 text-green-600 text-sm">
                            Verification link sent successfully.
                        </div>
                    )}

                    {/* BUTTON */}
                    <form onSubmit={submit} className="mt-6">

                        <button
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Resend Verification Email
                        </button>

                    </form>

                    {/* LOGOUT */}
                    <div className="mt-4">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-sm text-gray-600 hover:underline"
                        >
                            Logout
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}