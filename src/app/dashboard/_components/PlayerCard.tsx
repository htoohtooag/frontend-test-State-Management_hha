"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Player } from '@/redux/slices/teamSlice';

interface PlayerCardProps {
  player: Player;
  isAssigned: boolean;
  onAddToTeam?: (player: Player) => void;
  onRemoveFromTeam?: (playerId: number) => void;
  isInTeamView?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isAssigned,
  onAddToTeam,
  onRemoveFromTeam,
  isInTeamView = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/20 backdrop-blur-md border border-white/30 hover:border-violet-400 transition-colors duration-300 shadow-md hover:shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {player.first_name} {player.last_name}
            </h3>
            <p className="inline-block text-sm font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded mt-1 select-none">
              {player.position}
            </p>
            <p className="text-sm text-slate-600 truncate mt-1">{player.team.name}</p>
          </div>
          <div className="flex-shrink-0">
            {isInTeamView ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onRemoveFromTeam?.(player.id)}
                  variant="outline"
                  size="sm"
                  className="bg-rose-50/70 backdrop-blur-sm border-rose-400 text-rose-700 hover:bg-rose-100 hover:border-rose-500 rounded-md px-3 py-1.5"
                >
                  Remove
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onAddToTeam?.(player)}
                  disabled={isAssigned}
                  size="sm"
                  className={`rounded-md px-4 py-1.5 font-semibold transition-colors duration-300 ${
                    isAssigned
                      ? 'bg-slate-300/60 text-slate-600 cursor-not-allowed border border-slate-400/50'
                      : 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg hover:from-violet-700 hover:to-purple-800'
                  }`}
                >
                  {isAssigned ? 'Assigned' : 'Add'}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlayerCard;
