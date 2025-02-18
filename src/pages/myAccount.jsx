import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/myAccount.css"

const MyAccount = () => {
  const sales_id = '#04_[MJ]'
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);

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
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">คำขึ้นต้น</p>
            <p className="flex--contents">{salesData.prefix}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ชื่อ-นามสกุล</p>
            <p className="flex--contents">{salesData.fname} {salesData.lname}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">รหัสพนักงาน</p>
            <p className="flex--contents">{salesData.sales_id}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">อีเมลล์</p>
            <p className="flex--contents">{salesData.email}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">เบอร์โทร</p>
            <p className="flex--contents">{salesData.phone}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ที่อยุ่</p>
            <p className="flex--contents">{salesData.address}</p>
          </div>
          <hr className="account--line" />
          <div className="container__head">
            <p>ผู้ติดต่อฉุกเฉิน</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ชื่อ-นามสกุล</p>
            <p className="flex--contents">{salesData.emgname}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ความเกี่ยวข้อง</p>
            <p className="flex--contents">{salesData.emgrelationship}</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">เบอร์โทร</p>
            <p className="flex--contents">{salesData.emgphone}</p>
          </div>
          <hr className="account--line" />
          <div className="container__head">
            <p>ประเภทผู้ใช้</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ประเภทผู้ใช้</p>
            <p className="flex--contents">{salesData.usertype}</p>
          </div>
          <hr className="account--line" />
        </div>
      </div>
    </>
  );
};

export default MyAccount;
