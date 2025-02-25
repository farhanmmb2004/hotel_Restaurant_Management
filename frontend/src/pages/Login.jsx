// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { authService } from '../services/api.js';

// const Login = () => {
//     const { loginUser } = authService;
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await loginUser(credentials);
//       console.log(credentials);
//       login(response.data);
//       navigate(response.data.role === 'vendor' ? '/vendor/dasboard' : '/customer/listings');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         value={credentials.email}
//         onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//         placeholder="Email"
//       />
//       <input
//         type="password"
//         value={credentials.password}
//         onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//         placeholder="Password"
//       />
//       {error && <p>{error}</p>}
//       <button type="submit">Login</button>
//     </form>
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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      login(response.data);
      navigate(response.data.role === 'vendor' ? '/vendor/dashboard' : '/customer/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

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
          >
            Login
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
