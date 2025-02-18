import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./components/supabaseClient"
import Navbar from "./components/navbar";
import Home from "./pages/index";
import MyAccount from "./pages/myAccount";
import AddProperty from "./pages/addProperty";
import Property from "./pages/property";
import EditProperty from "./pages/EditProperty";
import EditMyAccount from "./pages/editMyAccount";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setLoading(true);

  //     const { data, error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.error("Auth error:", error);
  //       setIsAuthenticated(false);
  //     } else {
  //       setIsAuthenticated(!!data.session);
  //     }

  //     setLoading(false);
  //   };

  //   checkAuth();

  //   const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log("Auth event:", event);
  //     setIsAuthenticated(!!session);
  //   });

  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);

  // if (loading) {
  //   return <div>Loading test...</div>;
  // }

  return (
    <Router>
      <Navbar />
      {/* {isAuthenticated && <Navbar />} */}
      <Routes>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/addproperty" element={<AddProperty />} />
        <Route path="/property/:listing_id" element={<Property />} />
        <Route path="/property/Edit/:listing_id" element={<EditProperty />} />
        <Route path="/myaccount/Edit" element={<EditMyAccount />} />
        {/* <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/myaccount" element={isAuthenticated ? <MyAccount /> : <Navigate to="/login" />} />
        <Route path="/addproperty" element={isAuthenticated ? <AddProperty /> : <Navigate to="/login" />} />
        <Route path="/property/:listing_id" element={isAuthenticated ? <Property /> : <Navigate to="/login" />} />
        <Route path="/property/Edit/:listing_id" element={isAuthenticated ? <EditProperty /> : <Navigate to="/login" />} />
        <Route path="/myaccount/Edit" element={isAuthenticated ? <EditMyAccount /> : <Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;