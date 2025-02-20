import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/index.css";
import "../css/login.css";
import "../css/addProperty.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        const emailTrimmed = email.trim();
    
        if (!emailTrimmed || !password || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            setLoading(false);
            return;
        }
    
        if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
            setError("รูปแบบอีเมลไม่ถูกต้อง");
            setLoading(false);
            return;
        }
    
        if (password.length < 6) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            setLoading(false);
            return;
        }
    
        if (password !== confirmPassword) {
            setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            setLoading(false);
            return;
        }
    
        const { user, error } = await supabase.auth.signUp({
            email: emailTrimmed,  
            password,
        });
    
        if (error) {
            setError(error.message);
        } else {
            alert("กรุณาไปที่อีเมลล์ของท่านเพื่อยืนยันตัวตน");
            navigate("/login");
        }
    
        setLoading(false);
    };

    return (
        <>
        <div className="large__container">
        <div className="login__logo">
            <p className="logo--white">MA</p>
            <p className="logo--black">PROP</p>
        </div>
        <div className="login__container" style={{ "width": "400px" }}>
            <form className="login__form" noValidate onSubmit={handleSubmit} autoComplete="off">
                <p className="signup__header">ลงทะเบียน</p>
                <div className="signup__container">
                    <p className="container--text">อีเมลล์</p>
                    <input 
                        className="signup--input" 
                        type="email"
                        placeholder="อีเมลล์"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

export default Signup;