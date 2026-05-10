import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function SecurityIndex({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        password_min_length:          settings.password_min_length          ?? 8,
        password_require_uppercase:   settings.password_require_uppercase   ?? false,
        password_require_lowercase:   settings.password_require_lowercase   ?? false,
        password_require_numbers:     settings.password_require_numbers     ?? false,
        password_require_symbols:     settings.password_require_symbols     ?? false,
        session_timeout:              settings.session_timeout              ?? 60,
        max_login_attempts:           settings.max_login_attempts           ?? 5,
        lockout_duration:             settings.lockout_duration             ?? 30,
        two_factor_required:          settings.two_factor_required          ?? false,
        ip_whitelist_enabled:         settings.ip_whitelist_enabled         ?? false,
        ip_whitelist:                 settings.ip_whitelist                 ?? '',
        audit_log_enabled:            settings.audit_log_enabled            ?? true,
        audit_log_retention_days:     settings.audit_log_retention_days     ?? 90,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.security.update'));
    };

    return (
        <>
            <Head title="Security Settings" />

            <AdminLayout header={<h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>}>
                <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">

                        {/* Password Policy */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="password_min_length" value="Minimum Password Length" />
                                    <TextInput
                                        id="password_min_length"
                                        type="number"
                                        name="password_min_length"
                                        value={data.password_min_length}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('password_min_length', parseInt(e.target.value, 10))}
                                        min="6"
                                        max="32"
                                    />
                                    <InputError message={errors.password_min_length} className="mt-2" />
                                </div>

                                <div className="md:col-span-2">
                                    <div className="space-y-3">
                                        {[
                                            { id: 'password_require_uppercase', label: 'Require uppercase letters' },
                                            { id: 'password_require_lowercase', label: 'Require lowercase letters' },
                                            { id: 'password_require_numbers',   label: 'Require numbers' },
                                            { id: 'password_require_symbols',   label: 'Require symbols' },
                                        ].map(({ id, label }) => (
                                            <div key={id} className="flex items-center">
                                                <Checkbox
                                                    id={id}
                                                    name={id}
                                                    checked={data[id]}
                                                    onChange={(e) => setData(id, e.target.checked)}
                                                />
                                                <InputLabel htmlFor={id} value={label} className="ml-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Management */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="session_timeout" value="Session Timeout (minutes)" />
                                    <TextInput
                                        id="session_timeout"
                                        type="number"
                                        name="session_timeout"
                                        value={data.session_timeout}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('session_timeout', parseInt(e.target.value, 10))}
                                        min="15"
                                        max="480"
                                    />
                                    <InputError message={errors.session_timeout} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="max_login_attempts" value="Max Login Attempts" />
                                    <TextInput
                                        id="max_login_attempts"
                                        type="number"
                                        name="max_login_attempts"
                                        value={data.max_login_attempts}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('max_login_attempts', parseInt(e.target.value, 10))}
                                        min="3"
                                        max="10"
                                    />
                                    <InputError message={errors.max_login_attempts} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="lockout_duration" value="Lockout Duration (minutes)" />
                                    <TextInput
                                        id="lockout_duration"
                                        type="number"
                                        name="lockout_duration"
                                        value={data.lockout_duration}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('lockout_duration', parseInt(e.target.value, 10))}
                                        min="5"
                                        max="1440"
                                    />
                                    <InputError message={errors.lockout_duration} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                            <div className="flex items-center">
                                <Checkbox
                                    id="two_factor_required"
                                    name="two_factor_required"
                                    checked={data.two_factor_required}
                                    onChange={(e) => setData('two_factor_required', e.target.checked)}
                                />
                                <InputLabel htmlFor="two_factor_required" value="Require 2FA for all users" className="ml-2" />
                            </div>
                        </div>

                        {/* IP Whitelisting */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">IP Whitelisting</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="ip_whitelist_enabled"
                                        name="ip_whitelist_enabled"
                                        checked={data.ip_whitelist_enabled}
                                        onChange={(e) => setData('ip_whitelist_enabled', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="ip_whitelist_enabled" value="Enable IP whitelisting" className="ml-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="ip_whitelist" value="Allowed IP Addresses (comma-separated)" />
                                    <TextInput
                                        id="ip_whitelist"
                                        type="text"
                                        name="ip_whitelist"
                                        value={data.ip_whitelist}
                                        className={`mt-1 block w-full transition-opacity ${!data.ip_whitelist_enabled ? 'opacity-50' : ''}`}
                                        onChange={(e) => setData('ip_whitelist', e.target.value)}
                                        placeholder="192.168.1.1, 10.0.0.1, 172.16.0.0/16"
                                        disabled={!data.ip_whitelist_enabled}
                                    />
                                    <InputError message={errors.ip_whitelist} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Audit Logging */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logging</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="audit_log_enabled"
                                        name="audit_log_enabled"
                                        checked={data.audit_log_enabled}
                                        onChange={(e) => setData('audit_log_enabled', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="audit_log_enabled" value="Enable audit logging" className="ml-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="audit_log_retention_days" value="Log Retention (days)" />
                                    <TextInput
                                        id="audit_log_retention_days"
                                        type="number"
                                        name="audit_log_retention_days"
                                        value={data.audit_log_retention_days}
                                        className={`mt-1 block w-full transition-opacity ${!data.audit_log_enabled ? 'opacity-50' : ''}`}
                                        onChange={(e) => setData('audit_log_retention_days', parseInt(e.target.value, 10))}
                                        min="30"
                                        max="365"
                                        disabled={!data.audit_log_enabled}
                                    />
                                    <InputError message={errors.audit_log_retention_days} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Security Settings'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}