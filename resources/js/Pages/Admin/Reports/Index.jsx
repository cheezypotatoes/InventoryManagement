import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ReportsIndex({ reports = {} }) {
    const {
        total_inventory  = 0,
        low_stock_items  = 0,
        active_users     = 0,
        total_value      = 0,
        recent_reports   = [],
    } = reports;

    const { data, setData, post, processing, errors } = useForm({
        report_type: 'inventory_summary',
        date_from: '',
        date_to: '',
        format: 'pdf',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.reports.generate'), {
            preserveScroll: true,
        });
    };

    const downloadReport = (report) => {
        window.open(route('admin.reports.download', report.id), '_blank');
    };

    const viewReport = (report) => {
        router.get(route('admin.reports.show', report.id));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatReportType = (type) => {
        return type
            .split('_')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    const stats = [
        { label: 'Total Items',  value: total_inventory, color: 'text-indigo-600', format: 'number'   },
        { label: 'Low Stock',    value: low_stock_items,  color: 'text-red-600',    format: 'number'   },
        { label: 'Active Users', value: active_users,     color: 'text-green-600',  format: 'number'   },
        { label: 'Total Value',  value: total_value,      color: 'text-blue-600',   format: 'currency' },
    ];

    return (
        <>
            <Head title="Admin Reports" />

            <AdminLayout header={<h2 className="text-xl font-semibold text-gray-900">Reports</h2>}>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Report Generation Form */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Report</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label htmlFor="report_type" className="block text-sm font-medium text-gray-700">
                                        Report Type
                                    </label>
                                    <select
                                        id="report_type"
                                        value={data.report_type}
                                        onChange={(e) => setData('report_type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="inventory_summary">Inventory Summary</option>
                                        <option value="low_stock">Low Stock Items</option>
                                        <option value="user_activity">User Activity</option>
                                        <option value="sales_report">Sales Report</option>
                                        <option value="financial_summary">Financial Summary</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date_from"
                                            value={data.date_from}
                                            max={data.date_to || undefined}
                                            onChange={(e) => setData('date_from', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.date_from && (
                                            <p className="mt-1 text-sm text-red-600">{errors.date_from}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date_to"
                                            value={data.date_to}
                                            min={data.date_from || undefined}
                                            onChange={(e) => setData('date_to', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.date_to && (
                                            <p className="mt-1 text-sm text-red-600">{errors.date_to}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                                        Format
                                    </label>
                                    <select
                                        id="format"
                                        value={data.format}
                                        onChange={(e) => setData('format', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>

                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Generating...' : 'Generate Report'}
                                </PrimaryButton>
                            </form>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map(({ label, value, color, format }) => (
                                    <div key={label} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className={`text-2xl font-bold ${color}`}>
                                            {format === 'currency'
                                                ? formatCurrency(value)
                                                : Number(value).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recent_reports.length > 0 ? (
                                        recent_reports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {report.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                        {formatReportType(report.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                                                    {report.format}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(report.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                    <button
                                                        onClick={() => downloadReport(report)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Download
                                                    </button>
                                                    <button
                                                        onClick={() => viewReport(report)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                                No reports generated yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}