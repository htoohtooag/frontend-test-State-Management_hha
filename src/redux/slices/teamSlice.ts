import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Player {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    team: {
        id: number;
        name: string;
    };
}

export interface Team {
    id: string;
    name: string;
    playerCount: string;
    region: string;
    country: string;
    players: Player[];
    createdAt: string;
}

interface TeamsState {
    teams: Team[];
    assignedPlayerIds: number[]; // Changed from Set<number> to number[]
}

const loadTeamsState = (): TeamsState => {
    try {
        const savedTeams = localStorage.getItem('teams');
        if (savedTeams) {
            const parsed = JSON.parse(savedTeams);
            return {
                teams: parsed.teams || [],
                assignedPlayerIds: parsed.assignedPlayerIds || [],
            };
        }
    } catch (error) {
        console.error('Error loading teams state:', error);
    }
    return {
        teams: [],
        assignedPlayerIds: [],
    };
};

const saveTeamsState = (state: TeamsState) => {
    try {
        localStorage.setItem('teams', JSON.stringify({
            teams: state.teams,
            assignedPlayerIds: state.assignedPlayerIds,
        }));
    } catch (error) {
        console.error('Error saving teams state:', error);
    }
};

const initialState: TeamsState = loadTeamsState();

const teamsSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        createTeam: (state, action: PayloadAction<Omit<Team, 'id' | 'createdAt'>>) => {
            const newTeam: Team = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            state.teams.push(newTeam);
            saveTeamsState(state);
        },

        updateTeam: (state, action: PayloadAction<Team>) => {
            const index = state.teams.findIndex(team => team.id === action.payload.id);
            if (index !== -1) {
                state.teams[index] = action.payload;
                saveTeamsState(state);
            }
        },

        deleteTeam: (state, action: PayloadAction<string>) => {
            const team = state.teams.find(t => t.id === action.payload);
            if (team) {
                team.players.forEach(player => {
                    state.assignedPlayerIds = state.assignedPlayerIds.filter(id => id !== player.id);
                });
                state.teams = state.teams.filter(team => team.id !== action.payload);
                saveTeamsState(state);
            }
        },

        addPlayerToTeam: (state, action: PayloadAction<{ teamId: string; player: Player }>) => {
            const { teamId, player } = action.payload;
            const team = state.teams.find(t => t.id === teamId);
            if (team && !state.assignedPlayerIds.includes(player.id)) {
                team.players.push(player);
                team.playerCount = team.players.length.toString();
                state.assignedPlayerIds.push(player.id);
                saveTeamsState(state);
            }
        },

        removePlayerFromTeam: (state, action: PayloadAction<{ teamId: string; playerId: number }>) => {
            const { teamId, playerId } = action.payload;
            const team = state.teams.find(t => t.id === teamId);
            if (team) {
                team.players = team.players.filter(p => p.id !== playerId);
                team.playerCount = team.players.length.toString();
                state.assignedPlayerIds = state.assignedPlayerIds.filter(id => id !== playerId);
                saveTeamsState(state);
            }
        },

        resetTeams: (state) => {
            state.teams = [];
            state.assignedPlayerIds = [];
            try {
                localStorage.removeItem('teams');
            } catch (error) {
                console.error('Error clearing teams from storage:', error);
            }
        },
    },
});

export const {
    createTeam,
    updateTeam,
    deleteTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    resetTeams

    } = teamsSlice.actions;

export default teamsSlice.reducer;
