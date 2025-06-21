"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PlayerCard from './PlayerCard';
import { Button } from '@/components/ui/button';
import { Player } from '@/redux/slices/teamSlice';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { usePlayers } from '@/hooks/usePlayers';
import { Clock, AlertCircle } from 'lucide-react';

interface PlayersListProps {
  onPlayerSelect?: (player: Player) => void;
  showAddButton?: boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({ onPlayerSelect, showAddButton = true }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = usePlayers();
  const { assignedPlayerIds } = useAppSelector((state: RootState) => state.teamReducer);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);

  const allPlayers = data?.pages.flatMap(page => page.data) || [];

  // Handle API 429 cooldown
  useEffect(() => {
    if (error?.response?.status === 429) {
      setRateLimitCooldown(60);
      const interval = setInterval(() => {
        setRateLimitCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [error]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && rateLimitCooldown === 0) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '300px',
        threshold: 0.1,
      }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rateLimitCooldown]);

  const renderLoader = () => (
    <div className="flex justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (isLoading && allPlayers.length === 0) return renderLoader();

  return (
    <div className="space-y-6">
      {/* Error alert (non-blocking) */}
      {error && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <AlertCircle className="text-red-500" />
            <p className="text-red-500">
              {rateLimitCooldown > 0
                ? `API limit reached. Please wait ${rateLimitCooldown} seconds.`
                : 'Error loading more players. Try again shortly.'}
            </p>
          </div>
            <div className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-1">
              <Clock size={14} />
              <span>Free plan takes more times while fetching the next posts.</span>
            </div>
        </div>
      )}

      {/* Player grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {allPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PlayerCard
              player={player}
              isAssigned={assignedPlayerIds.includes(player.id)}
              onAddToTeam={showAddButton ? onPlayerSelect : undefined}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="h-1" />

      {/* Spinner while fetching more */}
      {isFetchingNextPage && renderLoader()}

      {/* Load more fallback button */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => fetchNextPage()}
              disabled={rateLimitCooldown > 0}
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 px-8 py-3"
            >
              {rateLimitCooldown > 0 ? `Retry in ${rateLimitCooldown}s` : 'Load More Players'}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PlayersList;
