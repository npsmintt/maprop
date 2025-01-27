import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHouseChimneyMedical } from '@fortawesome/free-solid-svg-icons';
import "../../css/navbar.css";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/400.css";

export const Navbar = () => {
    const userIcon = <FontAwesomeIcon icon={faUser} size="xl" />
    const addProperty = <FontAwesomeIcon icon={faHouseChimneyMedical} size="xl" />
    return (
        <>
        <div className="navbar">
            <div className="navbar__logo">
                <a href="/" className="navbar__link">
                    <div className="link--white">MA</div>
                    <div className="link--black">PROP</div>
                </a>
            </div>
            <div className="navbar__desc">
                    <p className="desc--separater">|</p>
                    <p className="desc--text">Property Smart Finder</p>
            </div>
            <div className="navbar__menu">
                <div className="navbar__icon-link">
                    <a href="/addproperty">
                        {addProperty}
                        <p>Add Property</p>
                    </a>
                </div>
                <div className="navbar__icon-link">
                    <a href="/myaccount">
                        {userIcon}
                        <p>My Account</p>
                    </a>
                </div>
            </div>
        </div>
        </>
    );
};

export default Navbar;