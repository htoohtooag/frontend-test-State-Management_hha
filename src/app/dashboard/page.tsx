"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, Trophy } from 'lucide-react';
import { RootState } from '@/redux/store';
import { addPlayerToTeam, Player, Team } from '@/redux/slices/teamSlice';
import Header from './_components/Header';
import TeamCard from './_components/TeamCard';
import TeamModal from './_components/TeamModal';
import PlayersList from './_components/PlayerList';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated,router]);

    const dispatch = useDispatch();
    const { teams } = useSelector((state: RootState) => state.teamReducer);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | undefined>();
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const existingTeamNames = teams.map(team => team.name);

    const handleCreateTeam = () => {
        setEditingTeam(undefined);
        setIsTeamModalOpen(true);
    };

    const handleEditTeam = (team: Team) => {
        setEditingTeam(team);
        setIsTeamModalOpen(true);
    };

    const handlePlayerSelect = (player: Player) => {
        setSelectedPlayer(player);
        setIsPlayerModalOpen(true);
    };

    const handleAddPlayerToTeam = (teamId: string) => {
        if (selectedPlayer) {
            dispatch(addPlayerToTeam({ teamId, player: selectedPlayer }));
            setIsPlayerModalOpen(false);
            setSelectedPlayer(null);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 300
            }
        }
    };

    const totalPlayers = teams.reduce((sum, team) => sum + parseInt(team.playerCount), 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-emerald-100"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 pointer-events-none" />

            <Header />
        
            <div className="container mx-auto px-6 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
                        >
                            Team Manager ⚡
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-slate-600 font-medium"
                        >
                            Build your dream teams and manage players effortlessly
                        </motion.p>
                    </div>
                    
                    {/* counting total temas, etc ....  (stars section) */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Total Teams</p>
                                    <p className="text-3xl font-bold text-violet-600">{teams.length}</p>
                                </div>
                                <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Total Players</p>
                                    <p className="text-3xl font-bold text-emerald-600">{totalPlayers}</p>
                                </div>
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Avg Team Size</p>
                                    <p className="text-3xl font-bold text-sky-600">
                                        {teams.length > 0 ? Math.round(totalPlayers / teams.length) : 0}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-3 rounded-xl">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>


                    <Tabs defaultValue="teams" className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <TabsList className="bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg p-1 rounded-xl">
                                <TabsTrigger
                                    value="teams"
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2 font-medium transition-all duration-300"
                                >
                                    🏆 Teams ({teams.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="players"
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2 font-medium transition-all duration-300"
                                >
                                    👥 Players
                                </TabsTrigger>
                            </TabsList>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={handleCreateTeam}
                                    className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-violet-400/50 transition-all duration-300 rounded-xl px-6 py-3 font-medium border-0"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create New Team
                                </Button>
                            </motion.div>
                        </div>
                        
                        {/* empty state and showing teamcard  */}
                        <TabsContent value="teams" key={`teams-${teams.length}`} className="space-y-6">
                            {teams.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center py-16"
                                >
                                    <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-12 border border-white/30 shadow-lg">
                                        <motion.div
                                            className="floating text-8xl mb-6"
                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                            transition={{ duration: 0.8 }}
                                        >
                                            <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center relative overflow-hidden shadow-inner">
                                                <div className="absolute inset-0 shimmer rounded-full"></div>
                                                <span className="text-4xl font-bold text-white relative z-10">🏀</span>
                                            </div>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-slate-700 mb-3">No teams yet</h3>
                                        <p className="text-slate-600 mb-8 leading-relaxed">Create your first team to start building your championship roster!</p>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={handleCreateTeam}
                                                className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-violet-400/50 transition-all duration-300 rounded-xl px-8 py-3 font-medium border-0"
                                            >
                                                <Plus className="h-5 w-5 mr-2" />
                                                Create Your First Team
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                                >
                                    {teams.map((team) => (
                                        <motion.div
                                            key={team.id}
                                            variants={itemVariants}
                                            whileHover={{
                                                y: -8,
                                                scale: 1.02,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            <TeamCard team={team} onEdit={handleEditTeam} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </TabsContent>
                        
                        {/* players tabs  */}
                        <TabsContent value="players">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <PlayersList onPlayerSelect={handlePlayerSelect} />
                            </motion.div>
                        </TabsContent>
                    </Tabs>

                </motion.div>
            </div>

            {/* create team and edit our team form  */}
            <TeamModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                team={editingTeam}
                existingTeamNames={existingTeamNames}
            />

            {/* adding player to our team ui  */}
            <Dialog open={isPlayerModalOpen} onOpenChange={setIsPlayerModalOpen}>
                <AnimatePresence>
                    {isPlayerModalOpen && (
                        <DialogContent className="bg-white/10 backdrop-blur-2xl border border-white/20 text-slate-800 shadow-2xl rounded-2xl">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-black font-mono">
                                        Add {selectedPlayer?.first_name} {selectedPlayer?.last_name} to Team 🏀
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4 mt-6">
                                    <p className="text-white/70 font-medium">
                                        Select a team to add this player to:
                                    </p>

                                    <div className="space-y-3 max-h-60 max-w-full overflow-auto scrollbar-thin scrollbar-thumb-violet-400/70 scrollbar-track-transparent scrollbar-thumb-rounded">
                                        {teams.map((team) => (
                                            <motion.div
                                                key={team.id}
                                                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                                            >
                                                <Button
                                                    onClick={() => handleAddPlayerToTeam(team.id)}
                                                    variant="outline"
                                                    className="w-full justify-start bg-white/20 backdrop-blur-sm border-white/40 text-slate-700 rounded-xl p-4 h-auto"
                                                >
                                                    <div className="text-left">
                                                        <div className="font-semibold text-slate-800">{team.name}</div>
                                                        <div className="text-sm text-slate-600">
                                                            {team.playerCount} players • {team.region}, {team.country}
                                                        </div>
                                                    </div>
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {teams.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-3">🏆</div>
                                            <p className="text-slate-600 font-medium">
                                                No teams available. Create a team first!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </DialogContent>
                    )}
                </AnimatePresence>
            </Dialog>
        </motion.div>
    );
};

export default Dashboard;