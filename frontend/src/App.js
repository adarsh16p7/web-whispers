import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { UserContextProvider } from './UserContext';
import AddPostPage from './pages/AddPostPage';
import SinglePostPage from './pages/SinglePostPage';
import EditPage from './pages/EditPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/addPost' element={<AddPostPage />} />
          <Route path='/post/:id' element={<SinglePostPage />} />
          <Route path='/edit/:id' element={<EditPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
