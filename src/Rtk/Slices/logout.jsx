// Auth.js (Redux Slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            return response.data; // Assuming response contains user and token
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for fetching user data
export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Assuming response contains user data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Handle fetchUser
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
