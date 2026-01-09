import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulate login API call
        try {
            await authService.login({
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="display-6 text-primary mb-2">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <h4 className="fw-bold fs-5">Welcome Back</h4>
                        <p className="text-muted small">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label htmlFor="password" className="form-label small fw-bold text-muted mb-0">PASSWORD</label>
                            </div>
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

                        <div className="mb-4 d-flex justify-content-between align-items-center">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="rememberPassword"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label small text-muted" htmlFor="rememberPassword">
                                    Remember password
                                </label>
                            </div>
                            <a href="#" className="text-decoration-none small text-primary" style={{ fontSize: '0.8rem' }}>Forgot password?</a>
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
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
