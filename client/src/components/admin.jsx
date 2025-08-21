// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Admin = ({ onLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (email === 'admin@example.com' && password === 'admin123') {
//       onLogin();
//       navigate('/dashboard');
//     } else {
//       alert('Invalid email or password');
//     }
//   };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const res = await fetch("http://localhost:3100/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await res.json();
//   if (res.ok) {
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("role", data.role);
//     navigate("/dashboard");
//   } else {
//     alert(data.error);
//   }
// };


//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
//       <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
//         {/* Company Logo or Title */}
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-extrabold text-blue-700 mb-1">EENBEEN</h2>
//           <p className="text-sm text-gray-500">Admin Panel Login</p>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit}>
//           {/* Email */}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
//             <input
//               autoFocus
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Admin;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3100/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Fire parent login callback
        onLogin();

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/dashboard");
        } else if (data.role === "sales") {
          navigate("/sales-dashboard");
        } else {
          navigate("/"); // fallback
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        {/* Company Logo or Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1">EENBEEN</h2>
          <p className="text-sm text-gray-500">Admin & Sales Panel Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              autoFocus
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
