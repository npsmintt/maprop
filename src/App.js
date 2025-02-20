import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import supabase from "./components/supabaseClient"
import Navbar from "./components/navbar";
import Home from "./pages/index";
import MyAccount from "./pages/myAccount";
import AddProperty from "./pages/addProperty";
import Property from "./pages/property";
import EditProperty from "./pages/EditProperty";
import EditMyAccount from "./pages/editMyAccount";
import Login from "./pages/login";
import Signup from "./pages/signup";
import SignupDetails from "./pages/signupDetails";
import ResetPassword from "./pages/resetPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(!!data.session);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div><FontAwesomeIcon icon={faSpinner} style={{ "color": "#1987AA" }}/></div>;
  }

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/form" element={<SignupDetails />} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/myaccount" element={isAuthenticated ? <MyAccount /> : <Navigate to="/login" />} />
          <Route path="/addproperty" element={isAuthenticated ? <AddProperty /> : <Navigate to="/login" />} />
          <Route path="/property/:listing_id" element={isAuthenticated ? <Property /> : <Navigate to="/login" />} />
          <Route path="/property/edit/:listing_id" element={isAuthenticated ? <EditProperty /> : <Navigate to="/login" />} />
          <Route path="/myaccount/edit" element={isAuthenticated ? <EditMyAccount /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const Layout = ({ isAuthenticated, children }) => {
  const location = useLocation();
  
  const hideNavbarPaths = ["/login", "/signup", "/form", "/reset-password"];
  
  const shouldShowNavbar = isAuthenticated && !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
};

export default App;