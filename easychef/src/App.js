import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Index from './pages/index/index'
import Profile from './pages/edit-profile/edit-profile';
import User  from './pages/profile/profile';
import Create from './pages/create/create';
import Cart from './pages/cart/cart';
import RecipeDisplay from './pages/recipe_display/recipe_display';
import UserRecipes from './pages/userrecipes/userrecipes';
import Search from './pages/search/search';
import React from 'react';

function App() {

  const home = (
    <h1>Welcome to our app!</h1>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={ <Index /> } />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="Profile/Edit" element={<Profile />} />
          <Route path="Recipe/Display" element={<RecipeDisplay />} />
          <Route path="/Profile/:id" element={<User />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/UserRecipes/:id" element = {<UserRecipes />}/>
          <Route path="/Search" element={<Search />}/>
          <Route path="/Cart" element={<Cart />}/>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
