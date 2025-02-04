import React from "react";
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
import ListingList from "./pages/listingList";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route exact path="/myaccount" element={<MyAccount />}/>
        <Route exact path="/addproperty" element={<AddProperty />}/>
        <Route exact path="/property" element={<Property />}/>
        <Route exact path="/listing" element={<ListingList />}/>
      </Routes>
    </Router>
  );
}

export default App;
