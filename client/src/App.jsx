import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import TodosPage from './pages/TodosPage';
import NotFound from './pages/NotFound';
import { fetchMe } from './features/auth/authSlice';
function Inner() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMe());
  }, [])
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/todos" element={<TodosPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Inner />
    </BrowserRouter>
  );
}
