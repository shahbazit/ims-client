import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: 'User',
                status: 'Active' // Or 'Pending' depending on requirements
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-sm border-0" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="display-6 text-primary mb-2">
                            <i className="bi bi-person-plus-fill"></i>
                        </div>
                        <h4 className="fw-bold fs-5">Create Account</h4>
                        <p className="text-muted small">Sign up to get started</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-2 mb-3">
                            <div className="col-6">
                                <label htmlFor="firstName" className="form-label small fw-bold text-muted">FIRST NAME</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <label htmlFor="lastName" className="form-label small fw-bold text-muted">LAST NAME</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label small fw-bold text-muted">EMAIL</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label small fw-bold text-muted">PASSWORD</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label small fw-bold text-muted">CONFIRM PASSWORD</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-lock-fill"></i>
                                </span>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3 text-uppercase fw-bold"
                            style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating Account...
                                </span>
                            ) : 'Sign Up'}
                        </button>

                        <div className="text-center">
                            <p className="small text-muted mb-0">
                                Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
