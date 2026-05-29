import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, UserCircle2 } from 'lucide-react';
import '../styles/admin.css';
import {
  ADMIN_DASHBOARD_PATH,
  adminApiClient,
  getAdminToken,
  getAdminUser,
  type AdminUser,
} from '../lib/admin';
import { getSafeRedirectPath } from '../config/auth';

type AdminLoginResponse = {
  token: string;
  admin: AdminUser;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nextPath = getSafeRedirectPath(params.get('next')) || ADMIN_DASHBOARD_PATH;
  const existingAdmin = getAdminUser();
  const existingAdminToken = getAdminToken();
  const [adminId, setAdminId] = useState(existingAdmin?.adminId || 'Admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingAdmin && existingAdminToken) {
      navigate(nextPath, { replace: true });
    }
  }, [existingAdmin, existingAdminToken, navigate, nextPath]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminApiClient.post<AdminLoginResponse>('/api/admin/login', {
        adminId,
        password,
      });

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      navigate(nextPath);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Unable to login as admin right now.');
      } else {
        setError('Unable to login as admin right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#64748b', fontWeight: 700 }}>
              Admin Access
            </div>
            <h1>LiveFit Dashboard</h1>
          </div>
        </div>

        <p>
          Sign in with the protected admin ID and password from your backend environment to manage yoga programs, uploads, and section copy.
        </p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-field full">
              <label htmlFor="admin-id">Admin ID</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-id"
                  value={adminId}
                  onChange={(event) => setAdminId(event.target.value)}
                  placeholder="Admin"
                  required
                  style={{ paddingLeft: 44 }}
                />
                <UserCircle2
                  size={18}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                />
              </div>
            </div>

            <div className="admin-form-field full">
              <label htmlFor="admin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="admin123"
                  required
                  style={{ paddingLeft: 44 }}
                />
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                />
              </div>
            </div>
          </div>

          <div className="admin-modal-actions" style={{ padding: '18px 0 0', justifyContent: 'stretch' }}>
            <button type="submit" className="admin-primary-button" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Open Admin Dashboard'}
            </button>
          </div>
        </form>

        <div className="admin-login-hint">
          Redirect after login: <strong>{nextPath}</strong>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
