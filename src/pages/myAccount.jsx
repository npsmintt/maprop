import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/myAccount.css"

const MyAccount = () => {
  const [email, setEmail] = useState(""); 
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchUserEmail = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error fetching user:", error.message);
        } else if (user) {
            setEmail(user.email); // This triggers a re-render
        }
    };

      fetchUserEmail();
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchSalesData = async () => {
        const { data, error } = await supabase
            .from("salesperson")
            .select("*")
            .eq("email", email)
            .single();

        if (error) {
            console.error("Error fetching sales data:", error.message);
        } else {
            setSalesData(data);
        }
    };

    fetchSalesData();
  }, [email]);

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out: ", error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="addProperty_container">
        <div className="container__form">
          <div className="container__head">
            <p>ข้อมูลส่วนตัว</p>
            <div>
              <button type="button"
                      className="btn--add"
                      onClick={() => 
                              navigate("/myaccount/edit", 
                              { state: { sales_id: salesData.sales_id } }
                      )}>
                แก้ไข
              </button>
              <button type="button"
                      className="btn--delete"
                      onClick={handleSignout}>
                ออกจากระบบ
              </button>
            </div>
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
            <p className="flex--head">ชื่อเล่น</p>
            <p className="flex--contents">{salesData.nickname}</p>
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
