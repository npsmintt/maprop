import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/index.css";
import "../css/login.css";
import "../css/addProperty.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [prefix, setPrefix] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [nickname, setNickname] = useState("");
    const [salesID, setSalesID] = useState("");
    const [phone, setPhone] = useState("");
    const userType = "ผู้ใช้";

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log(await supabase.auth.getUser());

        // Trim input values
        const emailTrimmed = username.trim();
        const passwordTrimmed = password.trim();
        const confirmPasswordTrimmed = confirmPassword.trim();
        const fnameTrimmed = fname.trim();
        const lnameTrimmed = lname.trim();
        const nicknameTrimmed = nickname.trim();
        const phoneTrimmed = phone.trim();
        const salesIDTrimmed = salesID.trim();

        // Validate required fields
        if (!emailTrimmed || !passwordTrimmed || !confirmPasswordTrimmed || !prefix || !fnameTrimmed || !lnameTrimmed || !nicknameTrimmed || !salesIDTrimmed || !phoneTrimmed) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            setLoading(false);
            return;
        }

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
            setError("รูปแบบอีเมลไม่ถูกต้อง");
            setLoading(false);
            return;
        }

        // Validate password length
        if (passwordTrimmed.length < 6) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            setLoading(false);
            return;
        }

        // Validate password confirmation
        if (passwordTrimmed !== confirmPasswordTrimmed) {
            setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Sign up the user in Supabase Auth
            const { error: signUpError } = await supabase.auth.signUp({
                email: emailTrimmed,
                password: passwordTrimmed,
            });

            if (signUpError) {
                console.error("Sign Up Error:", signUpError); 
                setError("signUpError", signUpError);
                setLoading(false);
                return;
            }

            // Step 2: Insert user data into `salesperson` table
            const { error: insertError } = await supabase.from("salesperson").insert([
                {
                    sales_id: salesIDTrimmed,
                    prefix: prefix,
                    fname: fnameTrimmed,
                    lname: lnameTrimmed,
                    nickname: nicknameTrimmed,
                    email: emailTrimmed,
                    phone: phoneTrimmed,
                    usertype: userType,
                },
            ]);

            if (insertError) {
                setError("insertError", insertError.message);
                setLoading(false);
                return;
            }

            // Redirect to login after successful registration
            navigate("/login");
        } catch (err) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
            console.error("Unexpected error:", err);
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
        <div style={{ width: "450px" }}>
        <div className="login__logo">
            <p className="logo--white">MA</p>
            <p className="logo--black">PROP</p>
        </div>
        <div className="login__container">
            <form className="login__form" noValidate onSubmit={handleSubmit}>
                <p className="signup__header">ลงทะเบียนผู้ใช้ใหม่</p>
                <div className="signup__container">
                    <p className="container--text">อีเมลล์</p>
                    <input 
                        className="signup--input" 
                        type="email"
                        placeholder="อีเมลล์"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>  
                <div className="signup__container">
                    <p className="container--text">รหัสผ่าน</p>
                    <input 
                        className="signup--input" 
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="signup__container">
                    <p className="container--text">ยืนยันรหัสผ่าน</p>
                    <input 
                        className="signup--input" 
                        type="password"
                        placeholder="ยืนยันรหัสผ่าน"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <p className="container--text">เบอร์โทร</p>
                    <input 
                        className="signup--input" 
                        type="tel"
                        placeholder="เบอร์โทร"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                {error && <p className="err__message">{error}</p>}
                <button className="btn--login" type="submit" disabled={loading}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} style={{ "color": "white" }}/>: "ลงทะเบียน"}
                </button>
            </form>
            <div className="signup__footer">
                <p>มีบัญชีผู้ใช้แล้ว?</p>
                <button className="btn--register" onClick={() => navigate("/login")}>
                    เข้าสู่ระบบ
                </button>   
            </div>     
        </div>
        </div>
        </>
    );
};

export default Register;