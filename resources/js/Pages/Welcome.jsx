import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Inventory System" />

            <div className="min-h-screen bg-gray-100 flex flex-col">

                {/* NAVBAR */}
                <header className="bg-white shadow">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                        <h1 className="text-xl font-bold text-gray-800">
                            Inventory System
                        </h1>

                        <nav className="space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* HERO SECTION */}
                <main className="flex-1 flex items-center justify-center px-6">

                    <div className="max-w-4xl text-center">

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                            Manage Your Inventory with Ease
                        </h2>

                        <p className="mt-4 text-gray-600 text-lg">
                            Track products, stock movements, sales, purchases, and accounts
                            all in one powerful system.
                        </p>

                        <div className="mt-8 flex justify-center gap-4">

                            <Link
                                href={route('login')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Login
                            </Link>

                        </div>
                    </div>

                </main>

                {/* FEATURES */}
                <section className="bg-white py-16">

                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

                        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg">📦 Inventory Tracking</h3>
                            <p className="text-gray-600 mt-2">
                                Monitor stock in real-time with automatic updates.
                            </p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg">🧾 Sales & Purchases</h3>
                            <p className="text-gray-600 mt-2">
                                Manage transactions and automatically update stock.
                            </p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg">💰 Accounts System</h3>
                            <p className="text-gray-600 mt-2">
                                Track income, expenses, and financial reports.
                            </p>
                        </div>

                    </div>
                </section>

                {/* FOOTER */}
                <footer className="text-center py-6 text-gray-500 text-sm">
                    Inventory Management System © {new Date().getFullYear()}
                </footer>

            </div>
        </>
    );
}