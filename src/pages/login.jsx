import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/index.css";
import "../css/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const [username, setUserName] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!username) {
            setError("กรุณากรอกชื่ออีเมลล์");
            setLoading(false);
            return;
        }

        if (!password) {
            setError("กรุณากรอกรหัสผ่าน");
            setLoading(false);
            return;
        }

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: username,
            password: password
        });

        if (loginError) {
            if (loginError.message.toLowerCase().includes("invalid login credentials")) {
                console.error(loginError.message)
                setError("อีเมลล์/รหัสผ่านไม่ถูกต้อง");
            } if (loginError.message.toLowerCase().includes("email not confirmed")) {
                console.error(loginError.message)
                setError("กรุณายืนยันอีเมลล์ก่อนเข้าสู่ระบบ");
            } else {
                console.error(loginError.message)
                setError(`เกิดข้อผิดพลาด: ${loginError.message}`);
            }
            setLoading(false);
            return;
        }

        const { data: salesperson, error: salespersonError } = await supabase
            .from('salesperson')
            .select('sales_id, email') 
            .eq('email', username) 
            .single(); 

        if (salespersonError || !salesperson) {
            setError("กรุณายืนยันอีเมลล์ก่อนเข้าสู่ระบบ");
            console.error(`Error fetching salesperson data: ${salespersonError?.message}`);
            setLoading(false);
            navigate("/form");
            return;
        }

        console.log("Salesperson found:", salesperson);
        setLoading(false);
        navigate("/", { state: { sales_id: salesperson.sales_id }});
    };

    const handleForgotPassword = async () => {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(username, {
            redirectTo: '/reset-password',
        });
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
                <p className="signup__header">เข้าสู่ระบบ</p>
                <label htmlFor="email">
                    <p className="form__label">อีเมลล์</p>
                </label>
                <input
                    className="form__input"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="กรุณากรอกอีเมลล์"
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
                {error && <p className="err__message">{error}</p>}
                <button className="btn--login" type="submit">
                    {loading ? <FontAwesomeIcon icon={faSpinner} style={{ "color": "white" }}/>: "เข้าสู่ระบบ"}
                </button>
            </form>
            <button 
            className="btn--register" 
            type="button"
            onClick={() => navigate("/signup")}>ลงทะเบียน</button>
        </div>
        </div>
        </>
    );
};

export default Login;