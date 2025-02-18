import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/myAccount.css"

const EditMyAccount = () => {
    const sales_id = '#04_[MJ]'
    const navigate = useNavigate();
    const [salesdata, setSalesData] = useState([]);
  
    useEffect(() => {
        fetchSalesData();
      }, [sales_id]);
    
    const fetchSalesData = async () => {
      const { data, error } = await supabase
        .from("salesperson")
        .select("*")
        .eq("sales_id", sales_id)
        .single();
    
      if (error) {
        console.error("Error fetching sales data:", error.message);
      } else {
        setSalesData(data);
      }
    };
  
    return (
      <>
        <div className="addProperty_container">
          <div className="container__form">
            <div className="container__head">
              <p>ข้อมูลส่วนตัว</p>
              <hr />
            </div>
            <div>
              <p>คำขึ้นต้น</p>
              <p></p>
            </div>
          </div>
        </div>
      </>
    );
  };

export default EditMyAccount;
