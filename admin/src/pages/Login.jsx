import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = role === 'Admin' ? 'admin' : 'doctor';
      const { data } = await axios.post(`${backendUrl}/api/${endpoint}/login`, { email, password });

      if (data.success) {
        const tokenKey = role === 'Admin' ? 'aToken' : 'dToken';
        role === 'Admin' ? setAToken(data.token) : setDToken(data.token);
        localStorage.setItem(tokenKey, data.token);

        toast.success(`${role} login successful`);

        // Redirect based on role
        navigate(role === 'Admin' ? '/admin/dashboard' : '/doctor/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>

        <div className="flex justify-center gap-4 mb-6">
          {['Admin', 'Doctor'].map((type) => (
            <button
              key={type}
              onClick={() => setRole(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                role === type
                  ? 'bg-primary text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded text-white bg-primary hover:bg-primary-dark transition ${
              isLoading && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </Link>
          <Link to="/reset-password" className="text-primary hover:underline">
            Reset Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;