import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/index.css";
import "../css/login.css";

const Login = () => {
    const [username, setUserName] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: username,
            password: password
        });

        if (loginError) {
            setError(`Login failed: ${loginError.message}`);
            console.error("Login failed:", loginError.message);
            return;
        }

        // After successful login, check if the email exists in the salesperson table
        const { data: salesperson, error: salespersonError } = await supabase
            .from('salesperson')
            .select('sales_id, email') // Select only the fields you need
            .eq('email', username) // Match the email with the input username
            .single(); // We expect only one result

        if (salespersonError) {
            setError(`Error fetching salesperson data: ${salespersonError.message}`);
            return;
        }

        if (!salesperson) {
            setError("ไม่มีบัญชีผู้ใช้นี้ในระบบ"); // If no match is found
            return;
        }

        // If salesperson is found, redirect to the homepage with sales_id
        console.log("Salesperson found:", salesperson);
        navigate("/", { state: { sales_id: salesperson.sales_id } });
    };

    const handleForgotPassword = async () => {
        const { error: resetError } = await supabase.auth.api.resetPasswordForEmail(username);
        if (resetError) {
            setError(`Password reset failed: ${resetError.message}`);
        } else {
            setError("Password reset email sent!");
        }
    };


    return (
        <>
        <div className="large__container">
        <div className="login__logo">
            <p className="logo--white">MA</p>
            <p className="logo--black">PROP</p>
        </div>
        <div className="login__container">
            <form className="login__form" noValidate onSubmit={handleSubmit}>
                <label htmlFor="email">
                    <p className="form__label">ชื่อผู้ใช้ / อีเมลล์</p>
                </label>
                <input
                    className="form__input"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="กรุณากรอกชื่อผู้ใช้/อีเมลล์"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label htmlFor="password">
                    <p className="form__label">รหัสผ่าน</p>
                </label>
                <input
                    className="form__input"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="กรุณากรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="form__btn">
                    <button 
                    className="btn--forget" 
                    onClick={handleForgotPassword}
                    type="button">ลืมรหัสผ่าน</button>
                </div>
                <button className="btn--login" type="submit">เข้าสู่ระบบ</button>
            </form>
            <button 
            className="btn--register" 
            type="button"
            onClick={() => navigate("/register")}>ลงทะเบียน</button>
        </div>
        </div>
        </>
    );
};

export default Login;