import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
    const { data } = await api.get('/profile');
    return data.user; // { id, email }
});
export const logout = createAsyncThunk('auth/logout', async () => {
    await api.post('/auth/logout');
    window.location.href = '/'; 
});
const slice = createSlice({
    name: 'auth',
    initialState: { user: null, status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (s) => { s.status = 'loading'; })
            .addCase(fetchMe.fulfilled, (s, a) => {
                s.status = 'succeeded'; s.user =
                    a.payload;
            })
            .addCase(fetchMe.rejected, (s) => { s.status = 'failed'; s.user = null; })
            .addCase(logout.fulfilled, (s) => { s.user = null; });
    },
});
export default slice.reducer;