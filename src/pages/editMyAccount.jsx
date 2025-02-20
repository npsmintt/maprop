import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/myAccount.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import supabaseService from "../components/supabaseClienService";

const EditMyAccount = () => {
  const location = useLocation();
  const salesID = location.state?.sales_id;
  const [salesData, setSalesData] = useState([]);
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emgName, setEmgName] = useState("");
  const [emgRelationship, setEmgRelationship] = useState("");
  const [emgPhone, setEmgPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (salesID) {
      fetchSalesData();
    }
  }, [salesID]);

  const fetchSalesData = async () => {
    const { data, error } = await supabase
      .from("salesperson")
      .select("*")
      .eq("sales_id", salesID)
      .single();

    if (error) {
      console.error("Error fetching sales data:", error.message);
    } else {
      setSalesData(data);
      setPrefix(data.prefix || "");
      setFname(data.fname || "");
      setLname(data.lname || "");
      setNickname(data.nickname || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setEmgName(data.emgname || "");
      setEmgRelationship(data.emgrelationship || "");
      setEmgPhone(data.emgphone || "");
    }
  };

  const handleDelete = async () => {
    if (!email) {
      alert("ไม่พบอีเมลล์ของผู้ใช้");
      return;
    }
  
    const { data: user, error: userError } = await supabase
      .from("salesperson")
      .select("auth_id")
      .eq("sales_id", salesID)
      .single();
  
    if (userError || !user?.auth_id) {
      console.error("Error fetching user auth ID:", userError?.message);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      return;
    }
  
    const { error: authError } = await supabaseService.auth.admin.deleteUser(user.auth_id);
  
    if (authError) {
      console.error("Error deleting user from Auth:", authError.message);
      alert("เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้");
      return;
    }
  
    const { error: dbError } = await supabase
      .from("salesperson")
      .delete()
      .eq("sales_id", salesID);
  
    if (dbError) {
      console.error("Error deleting account:", dbError.message);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } else {
      alert("ลบบัญชีสำเร็จ");
      navigate(`/login`);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from("salesperson")
      .update({
        prefix: prefix,
        fname: fname,
        lname: lname,
        nickname: nickname,
        phone: phone,
        address: address,
        emgname: emgName,
        emgrelationship: emgRelationship,
        emgphone: emgPhone,
      })
      .eq("sales_id", salesID);

    if (error) {
      console.error("Error updating salesperson:", error.message);
      alert("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } else {
      alert("แก้ไขรายการสำเร็จ");
      navigate(`/myaccount`);
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
                      className="btn--delete"
                      onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} /> ลบบัญชีผู้ใช้
              </button>
              <button type="button"
                      className="btn--add"
                      onClick={handleSave}>
                <FontAwesomeIcon icon={faFloppyDisk} /> บันทึก
              </button>
            </div>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">คำขึ้นต้น</p>
            <select className="flex--contents account--input" 
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
            </select>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <div className="container__flex">
              <p className="flex--head--name">ชื่อ</p>
              <input className="flex--contents account--input--name"
              onChange={(e) => setFname(e.target.value)}
              value={fname} />
            </div>
            <div className="container__flex">
              <p className="flex--head--name">นามสกุล</p>
              <input className="flex--contents account--input--name" 
              onChange={(e) => setLname(e.target.value)}
              value={lname} />
            </div>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ชื่อเล่น</p>
            <input className="flex--contents account--input"
            onChange={(e) => setNickname(e.target.value)}
            value={nickname} />
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">รหัสพนักงาน</p>
            <input className="flex--contents account--input account--input--disabled" value={salesID} readOnly />
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">อีเมลล์</p>
            <input className="flex--contents account--input account--input--disabled" value={email} readOnly />
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">เบอร์โทร</p>
            <input className="flex--contents account--input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}/>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ที่อยุ่</p>
            <input className="flex--contents account--input"
            onChange={(e) => setAddress(e.target.value)}
            value={address} />
          </div>
          <hr className="account--line" />
          <div className="container__head">
            <p>ผู้ติดต่อฉุกเฉิน</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ชื่อ-นามสกุล</p>
            <input className="flex--contents account--input"
            onChange={(e) => setEmgName(e.target.value)}
            value={emgName} />
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ความเกี่ยวข้อง</p>
            <input className="flex--contents account--input"
            onChange={(e) => setEmgRelationship(e.target.value)}
            value={emgRelationship} />
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">เบอร์โทร</p>
            <input className="flex--contents account--input"
            onChange={(e) => setEmgPhone(e.target.value)}
            value={emgPhone} />
          </div>
          <hr className="account--line" />
          <div className="container__head">
            <p>ประเภทผู้ใช้</p>
          </div>
          <hr className="account--line" />
          <div className="container__flex">
            <p className="flex--head">ประเภทผู้ใช้</p>
            <input className="flex--contents account--input account--input--disabled" 
            value={salesData.usertype} 
            readOnly />
          </div>
          <hr className="account--line" />
        </div>
      </div>
    </>
  );
};

export default EditMyAccount;
