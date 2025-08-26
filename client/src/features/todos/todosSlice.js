import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const loadTodos = createAsyncThunk('todos/load', async () => {
    const { data } = await api.get('/todos');
    return data;
});
export const addTodo = createAsyncThunk('todos/add', async (payload) => {
    const { data } = await api.post('/todos', payload);
    return data;
});
export const updateTodo = createAsyncThunk('todos/update', async ({ id,
    updates }) => {
    const { data } = await api.patch(`/todos/${id}`, updates);
    return data.todo;
});
export const deleteTodo = createAsyncThunk('todos/delete', async (id) => {
    await api.delete(`/todos/${id}`);
    return id;
});
const slice = createSlice({
    name: 'todos',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadTodos.pending, (s) => { s.status = 'loading'; })
            .addCase(loadTodos.fulfilled, (s, a) => {
                s.status = 'succeeded'; s.items
                    = a.payload;
            })
            .addCase(loadTodos.rejected, (s) => { s.status = 'failed'; })
            .addCase(addTodo.fulfilled, (s, a) => { s.items.unshift(a.payload); })
            .addCase(updateTodo.fulfilled, (s, a) => {
                const i = s.items.findIndex(t => t._id === a.payload._id);
                if (i !== -1) s.items[i] = a.payload;
            })
            .addCase(deleteTodo.fulfilled, (s, a) => {
                s.items = s.items.filter(t => t._id !== a.payload);
            });
    },
});

export default slice.reducer;