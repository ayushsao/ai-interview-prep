// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { Brain, Mail, Lock, User, AlertCircle, Briefcase } from 'lucide-react';

// function Register() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     targetRole: '',
//     experienceLevel: 'fresher'
//   });
//   const [validationError, setValidationError] = useState('');
//   const { register, isLoading, error, clearError } = useAuthStore();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setValidationError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     clearError();
//     setValidationError('');

//     if (formData.password !== formData.confirmPassword) {
//       setValidationError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setValidationError('Password must be at least 6 characters');
//       return;
//     }

//     const result = await register({
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       targetRole: formData.targetRole,
//       experienceLevel: formData.experienceLevel
//     });

//     if (result.success) {
//       navigate('/dashboard');
//     }
//   };

//   const displayError = error || validationError;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2">
//             <Brain className="h-10 w-10 text-primary-600" />
//             <span className="font-bold text-2xl text-gray-900">InterviewPrep AI</span>
//           </Link>
//         </div>

//         {/* Register Form */}
//         <div className="card">
//           <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Create Account</h1>
          
//           {displayError && (
//             <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
//               <AlertCircle className="h-5 w-5 flex-shrink-0" />
//               {displayError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="label">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="input pl-10"
//                   placeholder="John Doe"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="label">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="input pl-10"
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="label">Target Role (Optional)</label>
//               <div className="relative">
//                 <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="targetRole"
//                   value={formData.targetRole}
//                   onChange={handleChange}
//                   className="input pl-10"
//                   placeholder="e.g., Software Engineer"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="label">Experience Level</label>
//               <select
//                 name="experienceLevel"
//                 value={formData.experienceLevel}
//                 onChange={handleChange}
//                 className="input"
//               >
//                 <option value="fresher">Fresher (0-1 years)</option>
//                 <option value="junior">Junior (1-3 years)</option>
//                 <option value="mid">Mid-Level (3-5 years)</option>
//                 <option value="senior">Senior (5-8 years)</option>
//                 <option value="lead">Lead/Principal (8+ years)</option>
//               </select>
//             </div>

//             <div>
//               <label className="label">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="input pl-10"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="label">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="input pl-10"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full"
//             >
//               {isLoading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </form>

//           <p className="text-center text-gray-600 mt-6">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-600 font-medium hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Brain, Mail, Lock, User, AlertCircle, Briefcase } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    targetRole: "",
    experienceLevel: "fresher",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError("");
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    clearError();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    // const result = await register({
    //   fullName: formData.name, // 🔥 backend match
    //   email: formData.email,
    //   password: formData.password,
    //   targetRole: formData.targetRole,
    //   experienceLevel: formData.experienceLevel,
    // });
//     const result = await register({
//   name: formData.name, // ✅ backend expects this
//   email: formData.email,
//   password: formData.password,
//   targetRole: formData.targetRole,
//   experienceLevel: formData.experienceLevel,
// });

 const result=await register({
  name: formData.name,     // ✅ EXACT MATCH
  email: formData.email,
  password: formData.password,
  targetRole: formData.targetRole,
  experienceLevel: formData.experienceLevel,
});


    if (result.success) {
      navigate("/dashboard");
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold">InterviewPrep AI</span>
          </Link>
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-center mb-4">Create Account</h1>

          {displayError && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 flex gap-2">
              <AlertCircle size={18} />
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="targetRole"
              placeholder="Target Role (optional)"
              className="input"
              value={formData.targetRole}
              onChange={handleChange}
            />

            <select
              name="experienceLevel"
              className="input"
              value={formData.experienceLevel}
              onChange={handleChange}
            >
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
