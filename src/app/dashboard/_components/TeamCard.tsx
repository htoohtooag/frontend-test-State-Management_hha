"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import PlayerCard from './PlayerCard';
import { Edit, Trash2, Users, MapPin, Flag } from 'lucide-react';
import { deleteTeam, removePlayerFromTeam, Team, } from '@/redux/slices/teamSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onEdit }) => {
  const dispatch = useDispatch();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const confirmDelete = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (teamToDelete) {
      dispatch(deleteTeam(teamToDelete.id));
      setIsDeleteConfirmOpen(false);
      setTeamToDelete(null);
    }
  };

  const handleDeleteCancelled = () => {
    setIsDeleteConfirmOpen(false);
    setTeamToDelete(null);
  };

  const handleRemovePlayer = (playerId: number) => {
    dispatch(removePlayerFromTeam({ teamId: team.id, playerId }));
  };

  const getPlayerInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const avatarColors = [
    'bg-purple-500',
    'bg-emerald-500',
    'bg-sky-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-indigo-500',
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className="-ml-7 md:-ml-0 bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold text-slate-900 mb-3 truncate">
                  {team.name}
                </CardTitle>

                <div className="space-y-2 text-slate-800 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>{team.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-sky-600" />
                    <span>{team.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-violet-600" />
                    <span>{team.playerCount} players</span>
                  </div>
                </div>

                {team.players.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Team Members
                    </p>
                    <div className="flex -space-x-2">
                      {team.players.slice(0, 4).map((player, index) => (
                        <motion.div
                          key={player.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow ${avatarColors[index % avatarColors.length]
                            }`}
                          title={`${player.first_name} ${player.last_name}`}
                        >
                          {getPlayerInitials(
                            player.first_name,
                            player.last_name
                          )}
                        </motion.div>
                      ))}
                      {team.players.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 text-xs font-bold border-2 border-white shadow">
                          +{team.players.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => onEdit(team)}
                    size="sm"
                    variant="outline"
                    className="border-emerald-400 text-emerald-700 hover:bg-emerald-100 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => confirmDelete(team)}
                    size="sm"
                    variant="outline"
                    className="border-rose-400 text-rose-700 hover:bg-rose-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>

          {team.players.length > 0 && (
            <CardContent className="pt-0">
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-violet-600" />
                  Team Roster
                </h4>
                <div
                  className="space-y-2 max-h-24 overflow-y-auto overflow-x-hidden pr-2"
                >
                  {team.players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PlayerCard
                        player={player}
                        isAssigned={true}
                        onRemoveFromTeam={handleRemovePlayer}
                        isInTeamView={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

        </Card>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-lg p-5 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="my-1 text-gray-700">
            Are you sure you want to delete{' '}
            <strong>{teamToDelete?.name}</strong>? This will remove all players
            from the team.
          </p>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleDeleteCancelled}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteConfirmed}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamCard;
