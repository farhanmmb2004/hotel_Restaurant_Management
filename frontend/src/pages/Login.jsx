// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { authService } from '../services/api.js';

// const Login = () => {
//   const { loginUser } = authService;
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await loginUser(credentials);
//       login(response.data);
//       navigate(response.data.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

//         {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Email</label>
//             <input
//               type="email"
//               value={credentials.email}
//               onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Password</label>
//             <input
//               type="password"
//               value={credentials.password}
//               onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-4">
//           Don't have an account? 
//           <Link to="/register" className="text-blue-600 font-medium ml-1 hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api.js';

const Login = () => {
  const { loginUser } = authService;
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await loginUser(credentials);
      login(response.data);
      navigate(response.data.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {loading && (
          <p className="text-yellow-500 text-sm mb-4 text-center">
            First action can take time, please wait, server is getting started...
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Test Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 text-center">Test Credentials</h3>
          <div className="space-y-2 text-xs">
            <div className="bg-white rounded p-2">
              <p className="font-semibold text-gray-700">Customer Account:</p>
              <p className="text-gray-600">Email: <span className="font-mono">customer@hotelbooking.com</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">Password@2025</span></p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="font-semibold text-gray-700">Vendor/Partner Account:</p>
              <p className="text-gray-600">Email: <span className="font-mono">vendor@hotelbooking.com</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">Password@2025</span></p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <Link to="/register" className="text-blue-600 font-medium ml-1 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
