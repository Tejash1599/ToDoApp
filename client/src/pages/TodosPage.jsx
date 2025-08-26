import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTodos, addTodo, updateTodo, deleteTodo } from '../features/todos/todosSlice';
import { fetchMe, logout } from '../features/auth/authSlice';
export default function TodosPage() {
    const dispatch = useDispatch();
    const { items, status } = useSelector(s => s.todos);
    const user = useSelector(s => s.auth.user);
    const [title, setTitle] = useState('');

    useEffect(() => { dispatch(fetchMe()); }, [dispatch]);
    useEffect(() => { if (user) dispatch(loadTodos()); }, [user, dispatch]);

    if (!user) return <div style={{ padding: 24 }}>Loading / not logged in… <a
        href="/">Login</a></div>;
    return (
        <div style={{ maxWidth: 720, margin: '24px auto', padding: 24 }}>
            <header style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2>Your Todos</h2>
                <div>
                    <span style={{ marginRight: 12 }}>{user?.email}</span>
                    <button onClick={() => dispatch(logout())}>Logout</button>
                </div>
            </header>
            <form onSubmit={(e) => {
                e.preventDefault(); if (title.trim()) {
                    dispatch(addTodo({ title })); setTitle('');
                }
            }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a task" style={{ padding: 8, width: '70%' }} />
                <button type="submit" style={{ marginLeft: 8 }}>Add</button>
            </form>
            {status === 'loading' && <p>Loading…</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items?.map(t => (
                    <li key={t._id} style={{
                        display: 'flex', alignItems: 'center',
                        padding: '8px 0', borderBottom: '1px solid #eee'
                    }}>
                        <input type="checkbox" checked={t.completed} onChange={() =>
                            dispatch(updateTodo({ id: t._id, updates: { completed: !t.completed } }))} />
                        <input
                            style={{
                                marginLeft: 8,
                                flex: 1,
                                border: "none",
                                borderBottom: "1px dashed #ddd",
                                outline: "none", // remove blue border on focus
                                padding: "4px",
                            }}
                            value={t.title}
                            onChange={(e) =>
                                dispatch(
                                    updateTodo({
                                        id: t._id,
                                        updates: { title: e.target.value },
                                    })
                                )
                            }
                        />

                        <button onClick={() => dispatch(deleteTodo(t._id))} style={{
                            marginLeft: 8
                        }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}