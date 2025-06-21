"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { resetTeams } from '@/redux/slices/teamSlice';

const Header = () => {
    const dispatch = useAppDispatch();
    const { username } = useAppSelector((state: RootState) => state.authReducer);
    const router = useRouter();
    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetTeams())
        router.push('/login')
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50"
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" as const, stiffness: 200 }}
                    className="flex items-center space-x-3"
                >
                    <motion.div
                        className="w-12 h-12 floating relative"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center relative overflow-hidden shadow-md">
                            <div className="absolute inset-0 shimmer rounded-full"></div>
                            <span className="text-xl font-bold text-white relative z-10">🏀</span>
                        </div>

                    </motion.div>
                    <h1 className="hidden md:flex text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Team Manager
                    </h1>
                </motion.div>

                <div className="flex items-center space-x-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-black/90"
                    >
                        Welcome, <span className="font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">{username}</span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="border-white/30 text-black/50 hover:bg-white/10 hover:border-white/50 transition-all duration-300 rounded-xl"
                        >
                            Logout
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;