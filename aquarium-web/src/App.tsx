import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import MainLayout from './components/MainLayout';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/profile', element: <Profile /> },
      { path: '/shop', element: <Shop /> },
    ]
  },
  { path: '/', element: <Login /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
