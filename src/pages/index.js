import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/index.css";
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const Home = () => {
    const filterIcon = <FontAwesomeIcon icon={faSliders} size="md" />;
    const priceIcon = <FontAwesomeIcon icon={faTag} size="sm"/>
    const [keyword, setKeyword] = useState("");
    const handleSearch = (event) => {
        alert(`You searched for '${keyword}'`)
        // function to search property
    };
    const handleChange = (event) => {
        setKeyword(event.target.value);
    };
    const handleFilter = (event) => {
        setKeyword(event.target.value);
    };

    return (
        <>
        <div className="searchArea">
            <form action={handleSearch}>
                <input 
                    className="searchInput"
                    name="keyword" 
                    placeholder="ค้นหาด้วยคีย์เวิร์ด" 
                    value={keyword}
                    onChange={handleChange}
                />
                <button type="submit" className="searchButton">ค้นหา</button>
            </form>
            <button type="button" className="filterButton" onClick={handleFilter}>
                {filterIcon}
                <p>ตัวกรอง</p>
            </button>
        </div>
        <div className="container">
            <div className="map">
                <APIProvider apiKey={'AIzaSyCQEhPU1v5ATi-9CCX1PIYpGR-_Hx0N_GE'} onLoad={() => console.log('Maps API has loaded.')}>
                    <Map
                        mapId='7ef4f9d66b6db69f'
                        defaultZoom={13}
                        defaultCenter={ { lat: 13.705242300007146, lng: 100.63543752886405 } }
                        >
                    </Map>
                </APIProvider>
            </div>
            <div className="listHolder">
                <div className="listHolderHeader">
                    <div>
                        <p>รายชื่อรายการ<br />(100 รายการ)</p>
                    </div>
                    <div className="selectContainer">
                        <label for="sorting">เรียงจาก</label>
                        <div class="select-wrapper">
                            <select name="sorting" id="sorting">
                                <option value="pricelth" default>ราคา (น้อย-มาก)</option>
                                <option value="pricehtl">ราคา (มาก-น้อย)</option>
                                <option value="areastb">พื้นที่ (เล็ก-ใหญ่)</option>
                                <option value="areabts">พื้นที่ (ใหญ่-เล็ก)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="listingContainer">
                    <div className="listingPic">photo</div>
                    <div className="listing">
                        <div className="Tagging">
                            <p className="statusTag">สถานะ</p>
                            <p className="salesTypeTag">ขาย/เช่า</p>
                        </div>
                        <p className="listingName">ชื่อรายการ</p>
                        <p className="listingID">ID: ?</p>
                        <p className="listingType">ประเภท | ห้องนอน ? ห้องน้ำ ?</p>
                        <p className="listingPrice">{priceIcon} ? บาท</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;