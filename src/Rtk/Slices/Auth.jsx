import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart, loadCart } from './CartSlice'; // Import clearCart action

// Axios configuration
axios.defaults.baseURL = 'http://localhost:8080'; // Ensure the API endpoint is correct

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

// Define registerUser action
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/register', userData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Registration error' });
        }
    }
);

// Define loginUser action
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post('/api/login', credentials);
            console.log('Login response:', response.data); // Log the response
            const { token, user, cart } = response.data; // Assuming cart comes from the response

            // Save token to localStorage
            localStorage.setItem('token', token);

            // Dispatch loadCart action
            dispatch(loadCart(cart)); // Load the user's cart after login

            return { token, user }; // Return token and user info
        } catch (error) {
            console.error('Login error:', error); // Log the full error
            // Provide a more descriptive error message
            return rejectWithValue(error.response?.data?.message || 'Login failed. Please try again.');
        }
    }
);

// Define fetchUser action
export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.get('/api/me', {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Failed to fetch user' });
        }
    }
);

// Create Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Logout action to clear user and token
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        // registerUser
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token); // Save token to localStorage
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Registration failed'; // Safe access
        });

        // loginUser
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token); // Save token to localStorage
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Login failed'; // Safe access
        });

        // fetchUser
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to fetch user'; // Safe access
        });
    },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
