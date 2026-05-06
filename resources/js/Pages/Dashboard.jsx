import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold text-gray-800">
                    Inventory Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Products</p>
                        <h3 className="text-2xl font-bold">0</h3>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Stock In</p>
                        <h3 className="text-2xl font-bold text-green-600">0</h3>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Stock Out</p>
                        <h3 className="text-2xl font-bold text-red-600">0</h3>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-gray-500 text-sm">Low Stock</p>
                        <h3 className="text-2xl font-bold text-yellow-600">0</h3>
                    </div>

                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">
                        Recent Activity
                    </h3>
                    <p className="text-gray-500 text-sm">
                        No activity yet.
                    </p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}