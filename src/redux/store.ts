import { combineReducers, configureStore } from '@reduxjs/toolkit' 
import authReducer from "./slices/authSlice";
import teamReducer from "./slices/teamSlice";

const rootReducer = combineReducers({
    authReducer,
    teamReducer,
})

export const store =  configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
        serializableCheck: false,
    })
}); 


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store