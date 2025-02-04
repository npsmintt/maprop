import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/index.css";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import ListingList from "./listingList";

const googleAPI = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const Home = () => {
  const filterIcon = <FontAwesomeIcon icon={faSliders} size="md" />;
  const [keyword, setKeyword] = useState("");
  // const [filter, setFilter] = useState("");
  const handleSearch = (event) => {
    event.preventDefault();
    alert(`You searched for '${keyword}'`);
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
        <form onSubmit={handleSearch}>
          <input
            className="searchInput"
            name="keyword"
            placeholder="ค้นหาด้วยคีย์เวิร์ด"
            value={keyword}
            onChange={handleChange}
          />
          <button type="submit" className="searchButton">
            ค้นหา
          </button>
        </form>
        <button type="button" className="filterButton" onClick={handleFilter}>
          {filterIcon}
          <p>ตัวกรอง</p>
        </button>
      </div>
      <div className="container">
        <div className="map">
          <APIProvider
            apiKey={googleAPI}
            onLoad={() => console.log("Maps API has loaded.")}
          >
            <Map
              mapId="7ef4f9d66b6db69f"
              defaultZoom={13}
              defaultCenter={{
                lat: 13.705242300007146,
                lng: 100.63543752886405,
              }}
            />
          </APIProvider>
        </div>
        <div className="listHolder">
          <div className="listHolderHeader">
            <div>
              <p>
                รายชื่อรายการ
                <br />
                (100 รายการ)
              </p>
            </div>
            <div className="selectContainer">
              <label htmlFor="sorting">เรียงจาก</label>
              <div className="select-wrapper">
                <select name="sorting" id="sorting" defaultValue="pricelth">
                  <option value="pricelth">
                    ราคา (น้อย-มาก)
                  </option>
                  <option value="pricehtl">ราคา (มาก-น้อย)</option>
                  <option value="areastb">พื้นที่ (เล็ก-ใหญ่)</option>
                  <option value="areabts">พื้นที่ (ใหญ่-เล็ก)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="listingContainer">
            <ListingList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
