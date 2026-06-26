import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Pencil, Save, Search, ShieldCheck, UserCheck, Users, X } from 'lucide-react';
import Checkbox from '@mui/material/Checkbox';
import AppTextField from '../../components/AppTextField';
import userService from '../../services/userService';
import type { FormEvent } from 'react';
import type { UpdateUserPayload, UserDetails, UserItem } from '../../services/userService';

const emptyForm: UpdateUserPayload = {
  first_name: '',
  last_name: '',
  mobile_number: '',
  address: '',
  zipcode: '',
  city: '',
  district: '',
  state: '',
  is_admin: false,
};

const primaryButtonClass =
  'inline-flex items-center gap-2 rounded-md bg-common-btn-bg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-common-btn-hover disabled:cursor-not-allowed disabled:opacity-70';

const secondaryButtonClass =
  'inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--widget-bg)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--code-bg)] disabled:cursor-not-allowed disabled:opacity-50';

const getUserForm = (user: UserDetails): UpdateUserPayload => ({
  first_name: user.first_name || '',
  last_name: user.last_name || '',
  mobile_number: user.mobile_number || '',
  address: user.address || '',
  zipcode: user.zipcode || '',
  city: user.city || '',
  district: user.district || '',
  state: user.state || '',
  is_admin: Boolean(user.is_admin),
});

const valueOrDash = (value?: string | number | boolean | null) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value || '-';
};

const DetailItem = ({ label, value }: { label: string; value?: string | number | boolean | null }) => (
  <div className="rounded-md border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2">
    <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text)] opacity-80">{label}</dt>
    <dd className="mt-1 break-words text-sm font-medium text-[var(--text-h)]">{valueOrDash(value)}</dd>
  </div>
);

const UserTextField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof Omit<UpdateUserPayload, 'is_admin'>;
  value: string;
  onChange: (name: keyof Omit<UpdateUserPayload, 'is_admin'>, value: string) => void;
}) => (
  <AppTextField
    label={label}
    type="text"
    value={value}
    onChange={(event) => onChange(name, event.target.value)}
  />
);

const DealerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'vendors' | 'customers'>('vendors');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UpdateUserPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.fetchUsers();
      setUsers(res.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const name = `${u.first_name || ''} ${u.last_name || ''}`.trim().toLowerCase();
      return (
        !q ||
        name.includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.mobile_number || '').toLowerCase().includes(q) ||
        (u.user_type || '').toLowerCase().includes(q)
      );
    });
  }, [users, searchTerm]);

  const vendors = filtered.filter((u) => u.user_type === 'vendor');
  const customers = filtered.filter((u) => u.user_type === 'customer');

  const openUser = async (u: UserItem) => {
    setSelectedUserId(u.id);
    setSelectedUser(null);
    setIsEditing(false);
    setForm(emptyForm);
    setActionMessage('');
    setModalError('');
    setModalLoading(true);

    try {
      const user = await userService.fetchUser(u.id);
      setSelectedUser(user);
      setForm(getUserForm(user));
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
    setIsEditing(false);
    setActionMessage('');
    setModalError('');
  };

  const refreshSelectedUser = async (userId: number) => {
    const user = await userService.fetchUser(userId);
    setSelectedUser(user);
    setForm(getUserForm(user));
    await loadUsers();
  };

  const handleFieldChange = (name: keyof Omit<UpdateUserPayload, 'is_admin'>, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    setActionMessage('');
    setModalError('');
    try {
      const updated = await userService.updateUser(selectedUser.id, form);
      setSelectedUser(updated);
      setForm(getUserForm(updated));
      setIsEditing(false);
      setActionMessage('User details updated successfully');
      await loadUsers();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (isActive: boolean) => {
    if (!selectedUser) return;

    setStatusSaving(true);
    setActionMessage('');
    setModalError('');
    try {
      await userService.updateUserStatus(selectedUser.id, { is_active: isActive });
      await refreshSelectedUser(selectedUser.id);
      setActionMessage(`User marked as ${isActive ? 'active' : 'inactive'}`);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update user status');
    } finally {
      setStatusSaving(false);
    }
  };

  const handleVerify = async (userId: number, approve: boolean) => {
    setActionMessage('');
    setModalError('');
    setStatusSaving(true);
    try {
      const res = await userService.verifyVendor(userId, approve);
      setActionMessage('message' in res ? res.message : 'Vendor status updated successfully');
      await refreshSelectedUser(userId);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Users className="text-green-600 shrink-0" size={28} />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users Management</h1>
          </div>
          <p className="text-gray-500">View, filter, and manage users and vendors.</p>
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <AppTextField
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search users..."
            sx={{ '& .MuiInputBase-input': { paddingLeft: '2.25rem' } }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded ${activeTab === 'vendors' ? 'bg-green-600 text-white' : 'bg-white border'}`}
          >
            Vendors
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded ${activeTab === 'customers' ? 'bg-green-600 text-white' : 'bg-white border'}`}
          >
            Customers
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">User Type</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Verified</th>
                <th className="px-4 py-2">Vendor Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(activeTab === 'vendors' ? vendors : customers).map((u) => (
                <tr key={u.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openUser(u)}>
                  <td className="px-4 py-3">{`${u.first_name || ''} ${u.last_name || ''}`.trim()}</td>
                  <td className="px-4 py-3">{u.user_type}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.mobile_number}</td>
                  <td className="px-4 py-3">{u.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{u.is_verified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{u.vendor_verification_status ?? '-'}</td>
                </tr>
              ))}

              {(activeTab === 'vendors' ? vendors : customers).length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-xs text-gray-500" colSpan={7}>
                    {loading ? 'Loading...' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--widget-bg)] text-[var(--text)] shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[var(--text-h)]">User Details</h3>
                  {selectedUser && (
                    <>
                      <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--accent)]">
                        {selectedUser.user_type}
                      </span>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-h)]">
                        {selectedUser.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </>
                  )}
                </div>
                {selectedUser && (
                  <p className="mt-1 text-sm text-[var(--text)]">
                    {`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.email}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedUser && !isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={primaryButtonClass}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--widget-bg)] text-[var(--text)] transition-colors hover:bg-[var(--code-bg)]"
                  aria-label="Close user details"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-73px)] overflow-y-auto px-5 py-5">
              {modalLoading && (
                <div className="flex min-h-64 items-center justify-center text-sm text-[var(--text)]">
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Loading user details...
                </div>
              )}

              {modalError && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {modalError}
                </div>
              )}

              {selectedUser && !modalLoading && (
                <>
                  {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-5">
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-[var(--text-h)]">Editable information</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <UserTextField label="First name" name="first_name" value={form.first_name} onChange={handleFieldChange} />
                          <UserTextField label="Last name" name="last_name" value={form.last_name} onChange={handleFieldChange} />
                          <UserTextField label="Mobile number" name="mobile_number" value={form.mobile_number} onChange={handleFieldChange} />
                          <UserTextField label="Zipcode" name="zipcode" value={form.zipcode} onChange={handleFieldChange} />
                          <UserTextField label="City" name="city" value={form.city} onChange={handleFieldChange} />
                          <UserTextField label="District" name="district" value={form.district} onChange={handleFieldChange} />
                          <UserTextField label="State" name="state" value={form.state} onChange={handleFieldChange} />
                          <label className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-sm">
                            <Checkbox
                              checked={form.is_admin}
                              onChange={(event) => setForm((current) => ({ ...current, is_admin: event.target.checked }))}
                              sx={{
                                color: 'var(--text)',
                                padding: 0,
                                '&.Mui-checked': { color: 'var(--common-btn-bg)' },
                              }}
                            />
                            <span className="font-medium text-[var(--text-h)]">Admin user</span>
                          </label>
                          <div className="md:col-span-2">
                            <UserTextField label="Address" name="address" value={form.address} onChange={handleFieldChange} />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border)] pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setForm(getUserForm(selectedUser));
                            setIsEditing(false);
                          }}
                          className={secondaryButtonClass}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className={primaryButtonClass}
                        >
                          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                          Save changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <UserCheck className="text-[var(--common-btn-bg)]" size={18} />
                          <h4 className="text-sm font-semibold text-[var(--text-h)]">Profile</h4>
                        </div>
                        <dl className="grid gap-3 md:grid-cols-3">
                          <DetailItem label="Email" value={selectedUser.email} />
                          <DetailItem label="Mobile" value={selectedUser.mobile_number} />
                          <DetailItem label="Verified" value={selectedUser.is_verified} />
                          <DetailItem label="First name" value={selectedUser.first_name} />
                          <DetailItem label="Last name" value={selectedUser.last_name} />
                          <DetailItem label="User type" value={selectedUser.user_type} />
                          <DetailItem label="Address" value={selectedUser.address} />
                          <DetailItem label="Zipcode" value={selectedUser.zipcode} />
                          <DetailItem label="City" value={selectedUser.city} />
                          <DetailItem label="District" value={selectedUser.district} />
                          <DetailItem label="State" value={selectedUser.state} />
                          <DetailItem label="Admin" value={selectedUser.is_admin} />
                          <DetailItem label="Superuser" value={selectedUser.is_superuser} />
                          <DetailItem label="Vendor status" value={selectedUser.vendor_verification_status} />
                        </dl>
                      </section>

                      {selectedUser.vendor && (
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <ShieldCheck className="text-[var(--common-btn-bg)]" size={18} />
                            <h4 className="text-sm font-semibold text-[var(--text-h)]">Vendor company</h4>
                          </div>
                          <dl className="grid gap-3 md:grid-cols-3">
                            <DetailItem label="Company name" value={selectedUser.vendor.company_name} />
                            <DetailItem label="Registration no." value={selectedUser.vendor.company_registration_number} />
                            <DetailItem label="GST number" value={selectedUser.vendor.gst_number} />
                            <DetailItem label="Company phone" value={selectedUser.vendor.company_phone_number} />
                            <DetailItem label="Company email" value={selectedUser.vendor.company_email} />
                            <DetailItem label="Company address" value={selectedUser.vendor.company_address} />
                          </dl>
                        </section>
                      )}

                      <section className="rounded-md border border-[var(--border)] bg-[var(--code-bg)] p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--text-h)]">Account actions</h4>
                            <p className="mt-1 text-xs text-[var(--text)]">Update status and vendor verification without leaving this modal.</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={statusSaving || selectedUser.is_active}
                              onClick={() => handleStatusChange(true)}
                              className={secondaryButtonClass}
                            >
                              <CheckCircle2 size={16} />
                              Activate
                            </button>
                            <button
                              type="button"
                              disabled={statusSaving || !selectedUser.is_active}
                              onClick={() => handleStatusChange(false)}
                              className={secondaryButtonClass}
                            >
                              Deactivate
                            </button>
                            {selectedUser.user_type === 'vendor' && (
                              <>
                                <button
                                  type="button"
                                  disabled={statusSaving}
                                  onClick={() => handleVerify(selectedUser.id, true)}
                                  className={primaryButtonClass}
                                >
                                  Approve vendor
                                </button>
                                <button
                                  type="button"
                                  disabled={statusSaving}
                                  onClick={() => handleVerify(selectedUser.id, false)}
                                  className={secondaryButtonClass}
                                >
                                  Reject vendor
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  )}

                  {actionMessage && (
                    <div className="mt-4 rounded-md border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 py-2 text-sm font-medium text-[var(--text-h)]">
                      {actionMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerManagement;
