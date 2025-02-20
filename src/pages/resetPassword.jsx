import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/index.css";
import "../css/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
    const [password, setPassword] = useState(""); 
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!password) {
            setError("กรุณากรอกรหัสผ่านใหม่");
            setLoading(false);
            return;
        }

        if (!passwordConfirmation) {
            setError("กรุณายืนยันรหัสผ่าน");
            setLoading(false);
            return;
        }

        const { data, error: resetPasswordError } = await supabase.auth.updateUser({
            password: password
          })

        if (resetPasswordError) {
            setError(`Login failed: ${resetPasswordError.message}`);
            setLoading(false);
            return;
        }

        setLoading(false);
        alert("ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบใหม่อีกครั้ง")
        navigate("/login");
    };

    return (
        <>
        <div className="large__container">
        <div className="login__logo">
            <p className="logo--white">MA</p>
            <p className="logo--black">PROP</p>
        </div>
        <div className="login__container">
            <form className="login__form" noValidate onSubmit={handleSubmit} autoComplete="off">
                <p className="signup__header">ตั้งค่ารหัสผ่านใหม่</p>
                <label htmlFor="email">
                    <p className="form__label">รหัสผ่านใหม่</p>
                </label>
                <input
                    className="form__input"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="กรุณากรอกรหัสผ่านใหม่"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">
                    <p className="form__label">ยินยันรหัสผ่าน</p>
                </label>
                <input
                    className="form__input"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    placeholder="กรุณายืนยันรหัสผ่านใหม่"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
                {error && <p className="err__message">{error}</p>}
                <button className="btn--login" type="submit">
                    {loading ? <FontAwesomeIcon icon={faSpinner} style={{ "color": "white" }}/>: "ยืนยัน"}
                </button>
            </form>
        </div>
        </div>
        </>
    );
};

export default ResetPassword;