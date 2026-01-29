import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Loader2, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    console.log('=== LOGIN SUBMISSION STARTED ===');
    e.preventDefault();
    console.log('Form prevented default');
    setLoading(true);

    try {
      console.log('Form data:', formData);
      console.log('Email:', formData.email);
      console.log('Password:', formData.password ? '***' : 'empty');
      
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all fields');
        return;
      }
      
      console.log('About to call authAPI.login...');
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
        toast.success('Welcome back!');
        navigate('/admin');
      } else {
        toast.error('Login failed: Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || error.message || 'Login failed');
    } finally {
      setLoading(false);
      console.log('=== LOGIN SUBMISSION ENDED ===');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-purple-400 border-opacity-30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
            Tarot Reader 777
          </h1>
          <p className="text-purple-300">Admin Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-300 mb-2 font-medium">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="admin@tarot777.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-purple-300 mb-2 font-medium">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
          
          <p className="text-center text-purple-300 text-sm mt-4">
            Demo: admin@tarot777.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
