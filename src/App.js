import React, { useEffect } from "react";
import Navbar from "./components/navbar";
import { 
  BrowserRouter as Router,
  Routes,
  Route,
 } from 'react-router-dom';
import Home from "./pages/index";
import MyAccount from "./pages/myAccount";
import AddProperty from "./pages/addProperty";
import Property from "./pages/property";
import EditProperty from "./pages/EditProperty";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route exact path="/myaccount" element={<MyAccount />}/>
        <Route exact path="/addproperty" element={<AddProperty />}/>
        <Route path="/property/:listing_id" element={<Property />}/>
        <Route path="/property/Edit/:listing_id" element={<EditProperty />}/>
      </Routes>
    </Router>
  );
}

export default App;
