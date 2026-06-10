import React, { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';

type RegistrationStatus = 'Yes' | 'No';

type DealerUser = {
  id: string;
  name: string;
  userType: string;
  phone: string;
  registered: RegistrationStatus;
  companyName: string;
  companyRegNumber: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  gstNumber: string;
  initials: string;
};

type ColumnFilters = {
  name: string;
  userType: string;
  phone: string;
  registered: string;
  companyName: string;
  companyRegNumber: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  gstNumber: string;
};

const dealerUsers: DealerUser[] = [
  {
    id: 'USR-001',
    name: 'Ramesh Kumar',
    userType: 'Dealer',
    phone: '+91 98765 43210',
    registered: 'Yes',
    companyName: 'Kumar Agro Traders',
    companyRegNumber: 'KAT-2026-001',
    companyAddress: 'Market Yard Road, Pune, Maharashtra',
    companyPhone: '+91 20 2456 7812',
    companyEmail: 'contact@kumaragro.in',
    gstNumber: '27ABCDE1234F1Z5',
    initials: 'RK',
  },
  {
    id: 'USR-002',
    name: 'Anita Sharma',
    userType: 'Vendor',
    phone: '+91 99887 76655',
    registered: 'Yes',
    companyName: 'Sharma Farm Supply',
    companyRegNumber: 'SFS-2025-118',
    companyAddress: 'Sikar Road, Jaipur, Rajasthan',
    companyPhone: '+91 141 267 5544',
    companyEmail: 'sales@sharmafarmsupply.in',
    gstNumber: '08BCDEF2345G1Z2',
    initials: 'AS',
  },
  {
    id: 'USR-003',
    name: 'Imran Shaikh',
    userType: 'Distributor',
    phone: '+91 91234 56780',
    registered: 'No',
    companyName: 'Green Field Dealers',
    companyRegNumber: 'Pending',
    companyAddress: 'Niphad Road, Nashik, Maharashtra',
    companyPhone: '+91 253 244 1190',
    companyEmail: 'info@greenfielddealers.in',
    gstNumber: 'Pending',
    initials: 'IS',
  },
  {
    id: 'USR-004',
    name: 'Meera Patel',
    userType: 'Dealer',
    phone: '+91 90909 11223',
    registered: 'Yes',
    companyName: 'Patel Krishi Kendra',
    companyRegNumber: 'PKK-2024-078',
    companyAddress: 'Ring Road, Surat, Gujarat',
    companyPhone: '+91 261 289 3301',
    companyEmail: 'office@patelkrishi.in',
    gstNumber: '24CDEFG3456H1Z7',
    initials: 'MP',
  },
  {
    id: 'USR-005',
    name: 'Suresh Reddy',
    userType: 'Vendor',
    phone: '+91 93456 78901',
    registered: 'No',
    companyName: 'Reddy Agro Mart',
    companyRegNumber: 'Pending',
    companyAddress: 'Lakshmipuram Main Road, Guntur, Andhra Pradesh',
    companyPhone: '+91 863 224 7789',
    companyEmail: 'support@reddyagromart.in',
    gstNumber: 'Pending',
    initials: 'SR',
  },
];

const DealerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    name: '',
    userType: '',
    phone: '',
    registered: '',
    companyName: '',
    companyRegNumber: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    gstNumber: '',
  });

  const updateColumnFilter = (field: keyof ColumnFilters, value: string) => {
    setColumnFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  };

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedColumnFilters = Object.fromEntries(
      Object.entries(columnFilters).map(([key, value]) => [key, value.trim().toLowerCase()])
    ) as ColumnFilters;

    return dealerUsers.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          user.name,
          user.userType,
          user.phone,
          user.companyName,
          user.companyRegNumber,
          user.companyAddress,
          user.companyPhone,
          user.companyEmail,
          user.gstNumber,
          user.id,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus = statusFilter === 'all' || user.registered === statusFilter;
      const matchesColumnFilters =
        (!normalizedColumnFilters.name || user.name.toLowerCase().includes(normalizedColumnFilters.name)) &&
        (!normalizedColumnFilters.userType || user.userType.toLowerCase() === normalizedColumnFilters.userType) &&
        (!normalizedColumnFilters.phone || user.phone.toLowerCase().includes(normalizedColumnFilters.phone)) &&
        (!normalizedColumnFilters.registered || user.registered.toLowerCase() === normalizedColumnFilters.registered) &&
        (!normalizedColumnFilters.companyName ||
          user.companyName.toLowerCase().includes(normalizedColumnFilters.companyName)) &&
        (!normalizedColumnFilters.companyRegNumber ||
          user.companyRegNumber.toLowerCase().includes(normalizedColumnFilters.companyRegNumber)) &&
        (!normalizedColumnFilters.companyAddress ||
          user.companyAddress.toLowerCase().includes(normalizedColumnFilters.companyAddress)) &&
        (!normalizedColumnFilters.companyPhone ||
          user.companyPhone.toLowerCase().includes(normalizedColumnFilters.companyPhone)) &&
        (!normalizedColumnFilters.companyEmail ||
          user.companyEmail.toLowerCase().includes(normalizedColumnFilters.companyEmail)) &&
        (!normalizedColumnFilters.gstNumber || user.gstNumber.toLowerCase().includes(normalizedColumnFilters.gstNumber));

      return matchesSearch && matchesStatus && matchesColumnFilters;
    });
  }, [columnFilters, searchTerm, statusFilter]);

  const getStatusStyle = (status: RegistrationStatus) => {
    return status === 'Yes'
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-red-100 text-red-700 border border-red-200';
  };

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Users className="text-green-600 shrink-0" size={28} />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dealer Management</h1>
          </div>
          <p className="text-gray-500">View, filter, and manage user and vendor information.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-full lg:w-52 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="all">All users</option>
          <option value="Yes">Registered: Yes</option>
          <option value="No">Registered: No</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2 font-semibold text-gray-600 align-bottom" rowSpan={2}>
                  User Name
                </th>
                <th className="px-4 py-2 font-semibold text-gray-600 align-bottom" rowSpan={2}>
                  User Type
                </th>
                <th className="px-4 py-2 font-semibold text-gray-600 align-bottom" rowSpan={2}>
                  Mobile Number
                </th>
                <th className="px-4 py-2 font-semibold text-gray-600 align-bottom" rowSpan={2}>
                  Registered
                </th>
                <th className="px-4 py-2 font-semibold text-gray-700 text-center border-l border-gray-100" colSpan={6}>
                  Vendor Details
                </th>
              </tr>
              <tr className="border-t border-gray-100">
                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-l border-gray-100">
                  Company Name
                </th>
                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Company Reg Number
                </th>
                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Company Address
                </th>
                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Company Ph Number
                </th>
                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Company E Mail
                </th>
                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  GST Number
                </th>
              </tr>
              <tr className="border-t border-gray-100">
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.name}
                    onChange={(event) => updateColumnFilter('name', event.target.value)}
                    placeholder="Filter name"
                    className="w-full min-w-32 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <select
                    value={columnFilters.userType}
                    onChange={(event) => updateColumnFilter('userType', event.target.value)}
                    className="w-full min-w-28 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">All</option>
                    <option value="dealer">Dealer</option>
                    <option value="vendor">Vendor</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.phone}
                    onChange={(event) => updateColumnFilter('phone', event.target.value)}
                    placeholder="Filter mobile"
                    className="w-full min-w-36 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <select
                    value={columnFilters.registered}
                    onChange={(event) => updateColumnFilter('registered', event.target.value)}
                    className="w-full min-w-24 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </th>
                <th className="px-4 py-2 border-l border-gray-100">
                  <input
                    type="text"
                    value={columnFilters.companyName}
                    onChange={(event) => updateColumnFilter('companyName', event.target.value)}
                    placeholder="Filter company"
                    className="w-full min-w-36 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.companyRegNumber}
                    onChange={(event) => updateColumnFilter('companyRegNumber', event.target.value)}
                    placeholder="Filter reg no"
                    className="w-full min-w-36 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.companyAddress}
                    onChange={(event) => updateColumnFilter('companyAddress', event.target.value)}
                    placeholder="Filter address"
                    className="w-full min-w-48 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.companyPhone}
                    onChange={(event) => updateColumnFilter('companyPhone', event.target.value)}
                    placeholder="Filter phone"
                    className="w-full min-w-36 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.companyEmail}
                    onChange={(event) => updateColumnFilter('companyEmail', event.target.value)}
                    placeholder="Filter email"
                    className="w-full min-w-40 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
                <th className="px-4 py-2">
                  <input
                    type="text"
                    value={columnFilters.gstNumber}
                    onChange={(event) => updateColumnFilter('gstNumber', event.target.value)}
                    placeholder="Filter GST"
                    className="w-full min-w-36 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-normal outline-none focus:ring-1 focus:ring-green-500"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[11px] font-bold">
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 whitespace-nowrap">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.userType}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex min-w-12 justify-center px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(user.registered)}`}>
                      {user.registered}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 border-l border-gray-100 whitespace-nowrap">{user.companyName}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.companyRegNumber}</td>
                  <td className="px-4 py-3 text-gray-600 min-w-64">{user.companyAddress}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.companyPhone}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.companyEmail}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{user.gstNumber}</td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-xs text-gray-500" colSpan={10}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {dealerUsers.length} users
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealerManagement;
