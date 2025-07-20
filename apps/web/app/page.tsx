"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative w-full h-screen">
            <Image
                src="/LandingImage.webp"
                alt="Hero Image"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white bg-black/60">
            <motion.h1
            className="text-5xl font-bold text-center md:text-7xl font-display"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            >
            Welcome to McRyptoX
            </motion.h1>

            <motion.p
            className="max-w-2xl mt-6 text-xl font-light text-center md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            >
            The ultimate high-speed, high-security crypto exchange inspired by McLaren F1 Team.
            </motion.p>

            <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            >
            <Link href="/register" className="px-8 py-4 text-lg bg-orange-600 shadow-lg hover:bg-orange-500 rounded-2xl">
                Get Started
            </Link>
            </motion.div>
        </div>
        </div>
    )
}

// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { Typewriter } from 'react-simple-typewriter';

// export default function Home() {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="min-h-screen bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 text-white overflow-hidden relative"
//       style={{
//         backgroundImage: `url('/LandingImage3.webp')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundBlendMode: 'overlay',
//       }}
//     >
//         <div className="absolute inset-0 bg-black/60 z-0" />
//       {/* Background Glow Effect */}
//       <motion.div
//         className="absolute inset-0 bg-orange-500 opacity-10 blur-3xl rounded-full"
//         animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
//         transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
//       />
//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center h-[80vh] text-center px-4 relative z-10">
//         <motion.h1
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600"
//         >
//         <Typewriter
//             words={['Trade Crypto with P1 Precision']}
//             loop={1} // or set to false for no loop
//             cursor
//             cursorStyle="_"
//             typeSpeed={70}
//             deleteSpeed={50}
//             delaySpeed={1000}
//         />
//         </motion.h1>
//         <motion.p
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//           className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-lg"
//         >
//           Unleash lightning-fast trades, cutting-edge security, and a sleek interface inspired by the McLaren P1.
//         </motion.p>
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//         >
//           <Link
//             href="/register"
//             className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md text-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition duration-300"
//           >
//             Start Trading
//           </Link>
//         </motion.div>
//       </section>
//     </motion.div>
//   );
// }