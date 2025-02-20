import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/index.css";
import "../css/login.css";
import "../css/addProperty.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SignupDetails = () => {
    const [email, setEmail] = useState(""); 
    const [prefix, setPrefix] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [nickname, setNickname] = useState("");
    const [salesID, setSalesID] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [authID, setAuthID] = useState("");

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch logged-in user's email from Supabase Auth
    useEffect(() => {
        const fetchUserEmail = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
            } else if (user) {
                setEmail(user.email);
                setAuthID(user.id);
            }
        };

        fetchUserEmail();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!fname || !lname || !nickname || !phone || !salesID || !address) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.from("salesperson").insert([
                {
                    sales_id: salesID,
                    auth_id: authID,
                    prefix: prefix,
                    fname: fname,
                    lname: lname,
                    nickname: nickname,
                    email: email,
                    address: address,
                    phone: phone,
                    usertype: "ผู้ใช้"
                },
            ]);

            if (error) {
                console.error("Error saving user data:", error.message);
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            } else {
                alert("ข้อมูลถูกบันทึกสำเร็จ");
                navigate("/");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("เกิดข้อผิดพลาดบางประการ");
        }

        setLoading(false);
    };

    const handleSalesIDChange = (e) => {
        let inputValue = e.target.value;

        // Ensure input always starts with "#"
        if (!inputValue.startsWith("#")) {
            inputValue = "#" + inputValue.replace(/^#/, ""); // Prevent multiple "#"
        }

        setSalesID(inputValue);
    };

    return (
        <>
        <div className="large__container">
            <div className="login__logo">
                <p className="logo--white">MA</p>
                <p className="logo--black">PROP</p>
            </div>
            <div className="login__container" style={{ width: "400px" }}>
                <form className="login__form" noValidate onSubmit={handleSubmit}>
                    <p className="signup__header">ข้อมูลผู้ใช้ใหม่</p>
                    
                    {/* Prefilled Email Field */}
                    <div className="signup__container">
                        <p className="container--text">อีเมลล์</p>
                        <input 
                            className="signup--input" 
                            type="email"
                            placeholder="อีเมลล์"
                            value={email}
                            readOnly // Make it non-editable
                        />
                    </div>  

                    <div className="signup__container">
                        <p className="container--text">รหัสพนักงาน</p>
                        <input 
                            className="signup--input" 
                            type="text"
                            placeholder="รหัสพนักงาน"
                            value={salesID}
                            onChange={handleSalesIDChange}
                        />
                    </div>

                    <div className="signup__container">
                        <p className="container--text">คำขึ้นต้น</p>
                        <select 
                            className="signup--input"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                        >
                            <option value="" disabled>กรุณาเลือก</option>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </select>
                    </div>
                    
                    <div className="signup__container">
                        <p className="container--text">ชื่อ</p>
                        <input 
                            className="signup--input" 
                            type="text"
                            placeholder="ชื่อ"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>

                    <div className="signup__container">
                        <p className="container--text">นามสกุล</p>
                        <input 
                            className="signup--input" 
                            type="text"
                            placeholder="นามสกุล"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>

                    <div className="signup__container">
                        <p className="container--text">ชื่อเล่น</p>
                        <input 
                            className="signup--input" 
                            type="text"
                            placeholder="ชื่อเล่น"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    <div className="signup__container">
                        <p className="container--text">เบอร์โทร</p>
                        <input 
                            className="signup--input" 
                            type="tel"
                            placeholder="เบอร์โทร"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="signup__container--address">
                        <p className="container--text" style={{ "marginBottom": "5px", "marginTop": "5px" }}>ที่อยู่</p>
                        <textarea 
                            className="signup--address" 
                            type="tel"
                            placeholder="ที่อยู่"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {error && <p className="err__message">{error}</p>}

                    <button className="btn--login" type="submit" disabled={loading}>
                        {loading ? <FontAwesomeIcon icon={faSpinner} style={{ color: "white" }}/> : "เริ่มต้นใช้งาน"}
                    </button>
                </form>

                <div className="signup__footer">
                    <p>กลับสู่หน้า</p>
                    <button className="btn--register" onClick={() => navigate("/login")}>
                        เข้าสู่ระบบ
                    </button>   
                </div>     
            </div>
        </div>
        </>
    );
};

export default SignupDetails;