// app/register/page.tsx
"use client";

import AuthLayout from "../../components/AuthLayout";
import AuthHeader from "../../components/AuthHeader";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";
import { useState } from "react";
import { RegisterType } from "@repo/types/authTypes";
import { MouseEvent } from "@/types/events";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<RegisterType>({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({...credentials,[e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/register", credentials);
      if (res.status === 200) {
        router.push("/markets");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <AuthHeader title="Create Account" subtitle="Join the race to the future of finance."/>
        <AuthInput changeHandler={handleChange} type="text" name="name" placeholder="Adam Eve"/>
        <AuthInput changeHandler={handleChange} type="email" name="email" placeholder="example@email.com"/>
        <AuthInput changeHandler={handleChange} type="password" name="password" placeholder="password"/>
        <div className="w-full h-5 text-sm text-red-500 font-medium">
          {errorMessage}
        </div>
        <AuthButton text="Sign Up" clickHandler={handleSubmit} />
      </div>
    </AuthLayout>
  );
}
// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Signup:', { email, password, confirmPassword });
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
//           Sign Up for P1 Exchange
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
//           <div>
//             <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">Confirm Password</label>
//             <motion.input
//               id="confirm-password"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full p-3 bg-gray-900/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
//               placeholder="Confirm your password"
//               whileFocus={{ scale: 1.02 }}
//             />
//           </div>
//           <motion.button
//             onClick={handleSubmit}
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition duration-300"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Sign Up
//           </motion.button>
//         </div>
//         <p className="text-center text-gray-400 mt-6">
//           Already have an account?{' '}
//           <a href="/login" className="text-orange-500 hover:underline">Login</a>
//         </p>
//       </motion.div>
//     </motion.div>
//   );
// }