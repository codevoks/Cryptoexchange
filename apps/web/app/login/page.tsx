// app/login/page.tsx
'use client';
import AuthLayout from "../../components/AuthLayout";
import AuthHeader from "../../components/AuthHeader";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";
import { useState } from "react";
import { LogInType } from "@repo/types/authTypes";
import { ChangeEvent, MouseEvent } from "@/types/events";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [credentials,setCredentials] = useState<LogInType>({email:"",password:""});
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e:ChangeEvent)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value});
  }
  const handleSubmit = async (e:MouseEvent)=>{
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/login",credentials);
      if (res.status === 200) {
        router.push("/markets");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
      //alert(err);
    }
  }
  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <AuthHeader title="Welcome Back" subtitle="Enter your credentials to continue." />
        <AuthInput changeHandler={handleChange} type="email" name="email" placeholder="example@email.com" />
        <AuthInput changeHandler={handleChange} type="password" name="password" placeholder="password" />
        <div className="w-full h-5 text-sm text-red-500 font-medium">
          {errorMessage}
        </div>
        <AuthButton clickHandler={handleSubmit} text="Login" />
      </div>
    </AuthLayout>
  );
}

// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Login:', { email, password });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center"
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-gray-800/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl shadow-orange-500/20 w-full max-w-md border border-orange-500/30"
//       >
//         <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
//           Login to P1 Exchange
//         </h2>
//         <div className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
//             <motion.input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 bg-gray-900/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
//               placeholder="Enter your email"
//               whileFocus={{ scale: 1.02 }}
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
//             <motion.input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 bg-gray-900/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
//               placeholder="Enter your password"
//               whileFocus={{ scale: 1.02 }}
//             />
//           </div>
//           <motion.button
//             onClick={handleSubmit}
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition duration-300"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Login
//           </motion.button>
//         </div>
//         <p className="text-center text-gray-400 mt-6">
//           Don’t have an account?{' '}
//           <a href="/signup" className="text-orange-500 hover:underline">Sign Up</a>
//         </p>
//       </motion.div>
//     </motion.div>
//   );
// }