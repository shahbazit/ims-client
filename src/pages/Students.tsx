import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule]);


import { studentService } from '../services/studentService';
import type { Student } from '../types';

export default function Students() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        grade: 'Grade 10',
        status: 'Active'
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search & Filter State
    const [searchText, setSearchText] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Column Definitions
    const colDefs = useMemo<ColDef<Student>[]>(() => [
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
            field: 'grade',
            headerName: 'Grade',
            flex: 0.8,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <span className="badge bg-info bg-opacity-10 text-info px-2 py-1">
                        {params.value}
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
                        data-bs-target="#studentFormModal"
                        onClick={() => handleEdit(params.data)}
                        title="Edit Student"
                    >
                        <i className="bi bi-pencil-fill" style={{ fontSize: '0.9rem' }}></i>
                    </button>
                    <button
                        className="btn btn-sm btn-light text-danger d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bs-danger-bg-subtle)' }}
                        onClick={() => handleDelete(params.data.id)}
                        title="Delete Student"
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
        return students.filter(student => {
            const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
            const matchesStatus = statusFilter ? student.status === statusFilter : true;
            return matchesGrade && matchesStatus;
        });
    }, [students, gradeFilter, statusFilter]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const data = await studentService.getAll();
                setStudents(data);
                setError(null);
            } catch (err) {
                setError('Failed to load students. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
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
                // Update existing student
                const nameParts = formData.fullName.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '.';

                await studentService.update({
                    id: editingId,
                    firstName,
                    lastName,
                    email: formData.email,
                    grade: formData.grade,
                    status: formData.status
                });

                // Refresh list
                const data = await studentService.getAll();
                setStudents(data);

                // Close modal
                document.getElementById('student-modal-close-btn')?.click();
            } else {
                // Create new student
                const nameParts = formData.fullName.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '.';

                await studentService.create({
                    firstName,
                    lastName,
                    email: formData.email,
                    grade: formData.grade,
                    status: formData.status
                });

                // Refresh list
                const data = await studentService.getAll();
                setStudents(data);

                // Close modal
                document.getElementById('student-modal-close-btn')?.click();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save student');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            fullName: '',
            email: '',
            grade: 'Grade 10',
            status: 'Active'
        });
    };

    const handleEdit = (student: Student) => {
        setEditingId(student.id);
        setFormData({
            fullName: student.fullName,
            email: student.email,
            grade: student.grade,
            status: student.status
        });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.delete(id);
                const data = await studentService.getAll();
                setStudents(data);
            } catch (err: any) {
                console.error(err);
                alert(`Failed to delete student: ${err.message || 'Unknown error'}`);
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
                                    placeholder="Name, email..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Grade */}
                        <div className="col-md-2">
                            <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>GRADE</label>
                            <select
                                className="form-select form-select-sm text-muted"
                                value={gradeFilter}
                                onChange={(e) => setGradeFilter(e.target.value)}
                            >
                                <option value="">All Grades</option>
                                <option value="Grade 9">Grade 9</option>
                                <option value="Grade 10">Grade 10</option>
                                <option value="Grade 11">Grade 11</option>
                                <option value="Grade 12">Grade 12</option>
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
                                data-bs-target="#studentFormModal"
                                onClick={handleAdd}
                            >
                                <i className="bi bi-plus-lg me-1"></i> Add Student
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Student List AG Grid */}
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
                id="studentFormModal"
                tabIndex={-1}
                aria-labelledby="studentFormModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-white border-bottom-0 pb-0">
                            <h5 className="modal-title fw-bold fs-6" id="studentFormModalLabel">
                                {editingId ? 'Edit Student' : 'Add New Student'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="student-modal-close-btn"
                            ></button>
                        </div>
                        <div className="modal-body pt-0 pb-3">
                            {/* Tabs Nav */}
                            <ul className="nav nav-tabs mb-3 border-bottom-0 modal-tabs-custom" id="studentModalTabs" role="tablist">
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
                                        STUDENT DETAILS
                                    </button>
                                </li>
                            </ul>

                            <div className="tab-content" id="studentModalTabsContent">
                                {/* Tab 1: Student Details */}
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

                                            {/* Grade */}
                                            <div className="col-md-6">
                                                <label htmlFor="grade" className="form-label form-label-custom">GRADE</label>
                                                <select
                                                    className="form-select form-select-custom"
                                                    id="grade"
                                                    name="grade"
                                                    value={formData.grade}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Grade 9">Grade 9</option>
                                                    <option value="Grade 10">Grade 10</option>
                                                    <option value="Grade 11">Grade 11</option>
                                                    <option value="Grade 12">Grade 12</option>
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
                                        </div>
                                    </form>
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
