import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule]);


import { userService } from '../services/userService';
import type { User } from '../types';

export default function Users() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'User',
    status: 'Active',
    password: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Column Definitions
  const colDefs = useMemo<ColDef<User>[]>(() => [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      cellClass: 'fw-semibold text-dark',
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.8,
      cellRenderer: (params: ICellRendererParams) => {
        const role = params.value;
        const colorClass = role === 'Admin' ? 'danger' : role === 'Editor' ? 'info' : 'secondary';
        return (
          <span className={`badge bg-${colorClass} bg-opacity-10 text-${colorClass} px-2 py-1`}>
            {role}
          </span>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      cellRenderer: (params: ICellRendererParams) => {
        const status = params.value;
        const colorClass = status === 'Active' ? 'success' : status === 'Inactive' ? 'secondary' : 'warning';
        return (
          <span className={`badge rounded-pill bg-${colorClass} px-2`}>
            {status}
          </span>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="d-flex h-100 align-items-center justify-content-end gap-3">
          <button
            className="btn btn-sm btn-light text-primary d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px', borderRadius: '6px' }}
            data-bs-toggle="modal"
            data-bs-target="#userFormModal"
            onClick={() => handleEdit(params.data)}
            title="Edit User"
          >
            <i className="bi bi-pencil-fill" style={{ fontSize: '0.9rem' }}></i>
          </button>
          <button
            className="btn btn-sm btn-light text-danger d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bs-danger-bg-subtle)' }}
            onClick={() => handleDelete(params.data.id)}
            title="Delete User"
          >
            <i className="bi bi-trash3-fill" style={{ fontSize: '0.9rem' }}></i>
          </button>
        </div>
      ),
      cellClass: 'text-end pe-3'
    }
  ], []);

  // Filtered Data
  const rowData = useMemo(() => {
    return users.filter(user => {
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      return matchesRole && matchesStatus;
    });
  }, [users, roleFilter, statusFilter]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAll();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update existing user
        const nameParts = formData.fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '.';

        await userService.update({
          id: editingId,
          firstName,
          lastName,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          // Only send password if it's been changed (non-empty)
          ...(formData.password ? { password: formData.password } : {})
        });

        // Refresh list
        const data = await userService.getAll();
        setUsers(data);

        // Close modal
        document.getElementById('user-modal-close-btn')?.click();
      } else {
        // Create new user
        // Split full name into first and last name for API
        const nameParts = formData.fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '.'; // Fallback if no last name

        await userService.create({
          firstName,
          lastName,
          email: formData.email,
          password: formData.password || 'DefaultPassword123!', // Provide default or require it
          role: formData.role,
          status: formData.status
        });

        // Refresh list
        const data = await userService.getAll();
        setUsers(data);

        // Close modal
        document.getElementById('user-modal-close-btn')?.click();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save user');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'User',
      status: 'Active',
      password: ''
    });
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        const data = await userService.getAll();
        setUsers(data);
      } catch (err: any) {
        console.error(err);
        alert(`Failed to delete user: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="p-2">
      {/* Filter & Actions */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body p-2">
          <div className="row g-2 align-items-end">

            {/* Search */}
            <div className="col-md-4">
              <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>SEARCH</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Name, email, or ID..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            {/* Role */}
            <div className="col-md-2">
              <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>ROLE</label>
              <select
                className="form-select form-select-sm text-muted"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="User">User</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-md-2">
              <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>STATUS</label>
              <select
                className="form-select form-select-sm text-muted"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="col-md-4 d-flex justify-content-end gap-2">
              <button className="btn btn-outline-primary btn-sm px-3">
                <i className="bi bi-search me-1"></i> Search
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm px-3"
                data-bs-toggle="modal"
                data-bs-target="#userFormModal"
                onClick={handleAdd}
              >
                <i className="bi bi-plus-lg me-1"></i> Add User
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* User List AG Grid */}
      <div className="card shadow-sm border-0" style={{ height: '500px' }}>
        <div className="card-body p-0 ag-theme-quartz h-100 w-100 position-relative">
          {error && <div className="alert alert-danger m-2">{error}</div>}

          {loading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 100 }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            quickFilterText={searchText}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
            rowSelection="multiple"
          />
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="userFormModal"
        tabIndex={-1}
        aria-labelledby="userFormModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-white border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold fs-6" id="userFormModalLabel">
                {editingId ? 'Edit User' : 'Add New User'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="user-modal-close-btn"
              ></button>
            </div>
            <div className="modal-body pt-0 pb-3">
              {/* Tabs Nav */}
              <ul className="nav nav-tabs mb-3 border-bottom-0 modal-tabs-custom" id="userModalTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active small fw-bold"
                    id="details-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#details"
                    type="button"
                    role="tab"
                    aria-controls="details"
                    aria-selected="true"
                    style={{ fontSize: '0.8rem' }}
                  >
                    USER DETAILS
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link small fw-bold"
                    id="menu-rights-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-rights"
                    type="button"
                    role="tab"
                    aria-controls="menu-rights"
                    aria-selected="false"
                    style={{ fontSize: '0.8rem' }}
                  >
                    MENU RIGHTS
                  </button>
                </li>
              </ul>

              <div className="tab-content" id="userModalTabsContent">
                {/* Tab 1: User Details */}
                <div className="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
                  <form>
                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-md-6">
                        <label htmlFor="fullName" className="form-label form-label-custom">FULL NAME</label>
                        <input
                          type="text"
                          className="form-control form-control-custom"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label form-label-custom">EMAIL</label>
                        <input
                          type="email"
                          className="form-control form-control-custom"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Role */}
                      <div className="col-md-6">
                        <label htmlFor="role" className="form-label form-label-custom">ROLE</label>
                        <select
                          className="form-select form-select-custom"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="User">User</option>
                          <option value="Editor">Editor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div className="col-md-6">
                        <label htmlFor="status" className="form-label form-label-custom">STATUS</label>
                        <select
                          className="form-select form-select-custom"
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      {/* Password */}
                      <div className="col-md-6">
                        <label htmlFor="password" className="form-label form-label-custom">PASSWORD</label>
                        <input
                          type="password"
                          className="form-control form-control-custom"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Tab 2: Menu Rights (Placeholder) */}
                <div className="tab-pane fade" id="menu-rights" role="tabpanel" aria-labelledby="menu-rights-tab">
                  <div className="p-3 bg-light rounded text-center text-muted">
                    <i className="bi bi-shield-lock display-6 mb-2 d-block"></i>
                    <p className="small mb-0">Menu access configuration will appear here.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0 pb-3">
              <button
                type="button"
                className="btn btn-light btn-sm px-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm px-3"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}