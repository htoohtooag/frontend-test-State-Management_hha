"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { isAuthenticated } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated,router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError("Username is required");
            return;
        }
        if (username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }
        dispatch(login(username.trim()));
        router.push('/dashboard');

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/30 via-transparent to-white/20 relative overflow-hidden">

            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                    duration: 1.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-2xl border-white/10">
                    <CardHeader className="text-center relative">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.5,
                                type: "spring",
                                stiffness: 200,
                                damping: 10,
                            }}
                            className="mx-auto w-20 h-20 mb-6 floating"
                        >
                            <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-400 rounded-full flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 shimmer rounded-full"></div>
                                <span className="text-3xl font-bold text-white relative z-10">🏀</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
                                Team Manager
                            </CardTitle>
                            <CardDescription className="text-black/60 text-md font-medium">
                                Welcome to the professional basketball team management platform
                            </CardDescription>
                        </motion.div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError("");
                                    }}
                                    className="bg-white text-black placeholder:text-black/50 border-black/20 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 h-12 text-lg rounded-xl"
                                />
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-red-500 text-sm mt-2 font-medium"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.6 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 hover:from-teal-500 hover:via-sky-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-101 hover:shadow-2xl hover:shadow-sky-400/50 text-lg relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Enter Dashboard</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
