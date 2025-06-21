"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Team, createTeam, updateTeam, } from '@/redux/slices/teamSlice';
import { toast } from 'sonner';

interface TeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    team?: Team;
    existingTeamNames: string[];
}
const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, team, existingTeamNames }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    playerCount: '',
    region: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        playerCount: String(team.playerCount), 
        region: team.region,
        country: team.country,
      });
    } else {
      setFormData({
        name: '',
        playerCount: '0', 
        region: '',
        country: '',
      });
    }
    setErrors({});
  }, [team, isOpen]);

  const isCreateMode = !team;
  const isSubmitDisabled = isCreateMode;

  const validateForm = () => {

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    } else if (
      existingTeamNames.includes(formData.name.trim()) &&
      (!team || team.name !== formData.name.trim())
    ) {
      newErrors.name = 'Team name must be unique';
    }

    if (parseInt(formData.playerCount) < 0) {
      newErrors.playerCount = 'Player count cannot be negative';
    }

    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast("Validation Error", {
        description: "Please fix the errors below and try again.",
      });
      return;
    }

    if (team) {
      dispatch(
        updateTeam({
          ...team,
          name: formData.name.trim(),
          playerCount: formData.playerCount,
          region: formData.region.trim(),
          country: formData.country.trim(),
        })
      );

      toast("Team Updated! 🎉", {
        description: `${formData.name} has been successfully updated.`,
      });
    } else {
      dispatch(
        createTeam({
          name: formData.name.trim(),
          playerCount: "0",  // Always 0 on creation
          region: formData.region.trim(),
          country: formData.country.trim(),
          players: [],
        })
      );

      toast("Team Created! 🚀", {
        description: `Welcome to ${formData.name}! Start adding players to build your dream team.`,
      });
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    // i think, have to convert to stirng , Pcount is change to text version
    setFormData(prev => ({ ...prev, [field]: String(value) }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="bg-white/10 backdrop-blur-lg border border-white/25 text-white max-w-md shadow-lg rounded-3xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold text-center bg-clip-text text-black/80 font-mono">
                  {team ? 'Edit Our Team' : 'Create New Team'}
                </DialogTitle>
                <DialogDescription className="text-center text-slate-900 mt-2">
                  {team ? 'Update your team details' : 'Create a new team and start building your roster'}
                </DialogDescription>
              </DialogHeader>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="space-y-6 mt-6"
              >
                <div className="space-y-5">
                  {/* Team Name */}
                  <div>
                    <Label htmlFor="name" className="text-white font-semibold mb-1">Team Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 focus:bg-white/30 focus:border-cyan-400 focus:shadow-cyan-300/60 placeholder:text-white/70 text-black ${errors.name ? 'border-rose-500 bg-rose-600/20 placeholder-rose-300' : ''
                        } rounded-lg`}
                      placeholder="Enter team name"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-rose-400 text-sm mt-2 font-semibold flex items-center gap-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Player Count - disabled in create mode */}
                  <div>
                    <Label htmlFor="playerCount" className="text-white font-semibold mb-1">Player Count</Label>
                    <Input
                      id="playerCount"
                      type="text"
                      value={formData.playerCount}
                      onChange={(e) => handleInputChange('playerCount', e.target.value)}
                      disabled={isCreateMode}
                      className={`bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 focus:bg-white/30 focus:border-orange-400 focus:shadow-orange-300/60 placeholder:text-white/70 text-black ${errors.playerCount ? 'border-rose-500 bg-rose-600/20 placeholder-rose-300' : ''
                        } rounded-lg disabled:cursor-not-allowed disabled:opacity-50`}
                      placeholder='Player count is 0 on creation'
                    />
                    <AnimatePresence>
                      {errors.playerCount && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-rose-400 text-sm mt-2 font-semibold flex items-center gap-1"
                        >
                          {errors.playerCount}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Region */}
                  <div>
                    <Label htmlFor="region" className="text-white font-semibold mb-1">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className={`bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 focus:bg-white/30 focus:border-emerald-400 focus:shadow-emerald-300/60 placeholder:text-white/70 text-black ${errors.region ? 'border-rose-500 bg-rose-600/20 placeholder-rose-300' : ''
                        } rounded-lg`}
                      placeholder="Enter region"
                    />
                    <AnimatePresence>
                      {errors.region && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-rose-400 text-sm mt-2 font-semibold flex items-center gap-1"
                        >
                          {errors.region}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Country */}
                  <div>
                    <Label htmlFor="country" className="text-white font-semibold mb-1">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={`bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 focus:bg-white/30 focus:border-sky-400 focus:shadow-sky-300/60 placeholder:text-white/70 text-black  ${errors.country ? 'border-rose-500 bg-rose-600/20 placeholder-rose-300' : ''
                        } rounded-lg`}
                      placeholder="Enter country"
                    />
                    <AnimatePresence>
                      {errors.country && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-rose-400 text-sm mt-2 font-semibold flex items-center gap-1"
                        >
                          {errors.country}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: isSubmitDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitDisabled ? 1 : 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      className="w-full"
                    >
                      {team ? '✨ Update Team' : '🚀 Create Team'}
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default TeamModal;
