import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [asAdmin, setAsAdmin] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const saved = JSON.parse(localStorage.getItem('quizzo_user'));
      if (saved && saved.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-p-pink/10 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Quizzo</h1>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setAsAdmin(false)} className={`py-2 px-4 rounded ${!asAdmin? 'bg-p-mint' : 'bg-gray-100'}`}>Login as User</button>
          <button onClick={() => setAsAdmin(true)} className={`py-2 px-4 rounded ${asAdmin? 'bg-p-lav' : 'bg-gray-100'}`}>Login as Admin</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full p-2 border rounded" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          <button disabled={loading} type="submit" className="w-full py-2 rounded bg-p-blue text-white">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Don’t have an account? <a href="/register" className="text-p-lav">Register</a>
        </div>
      </div>
    </div>
  );
}