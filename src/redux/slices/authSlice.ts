
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
  isAuthenticated: boolean;
  username: string | null;
}

const loadAuthState = (): IAuthState => {
  try {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  return {
    isAuthenticated: false,
    username: null,
  };
};

const initialState: IAuthState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.username = action.payload;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;