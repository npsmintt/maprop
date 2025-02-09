import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../components/supabaseClient";
import "../css/addProperty.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faBuilding,
  faHouse,
  faKaaba,
} from "@fortawesome/free-solid-svg-icons";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapControl,
  ControlPosition,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import googleAPI from "../components/googleAPI";
import "../css/property.css";

const Property = () => {
  const { listing_id } = useParams();
  const navigate = useNavigate();
  const [listingData, setListingData] = useState(null);
  const [owner, setOwner] = useState([]);
  const [updateBy, setUpdateBy] = useState([]);

  useEffect(() => {
    fetchProperty();
  }, [listing_id]);
  
  useEffect(() => {
    if (listingData) {
      getSalesName();
    }
  }, [listingData]);

  const fetchProperty = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("listing_id", listing_id)
      .single();
  
    if (error) {
      console.error("Error fetching property:", error.message);
    } else {
      setListingData(data);
    }
  };

  const getSalesName = async () => {
    const { data, error } = await supabase
      .from("salesperson")
      .select("sales_id, nickname");
  
    if (error) {
      console.error("Error fetching salesperson: ", error.message);
      return;
    }
  
    const salesperson = data.find(person => person.sales_id === listingData.salesperson);
    const updateBy = data.find(person => person.sales_id === listingData.update_by);
    
    if (salesperson) {
      setOwner(salesperson.nickname);
    } else {
      console.log("Salesperson not found");
    }

    if (updateBy) {
      setUpdateBy(updateBy.nickname);
    } else {
      console.log("update_by not found");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
  };

  const typeConvert = (type) => {
    switch (type) {
      case "CD":
        return "คอนโด";
      case "CB":
        return "อาคารพาณิชย์";
      case "DH":
        return "บ้านเดี่ยว";
      case "L":
        return "ที่ดิน";
      case "TH":
        return "ทาวน์เฮ้าส์";
      case "TW":
        return "บ้านแฝด";
      default:
        return "";
    }
  };

  const handleEditClick = () => {
    navigate(`/property/edit/${listing_id}`);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from("listings")
      .update(listingData)
      .eq("listing_id", listing_id);

    if (error) {
      console.error("Error updating property:", error.message);
      alert("Error saving data");
    } else {
      alert("Data updated successfully");
      navigate("/");
    }
  };

  if (!listingData) return <p>Loading...</p>;

  return (
    <>
      <div className="addProperty_container">
        <form className="container__form" onSubmit={handleSave}>
          <div className="container__header">
            <div className="header__select">
              <div
                className={`select--status ${
                  listingData.status === "Active"
                    ? "status--active"
                    : "status--inactive"
                }`}
              >
                {listingData.status}
              </div>
              <div
                className={`select--tradeType ${
                  listingData.tradetype === "เช่า"
                    ? "trade--renting"
                    : "trade--selling"
                }`}
              >
                {listingData.tradetype}
              </div>
              <button
                type="button"
                className="btn--add"
                style={{ marginLeft: "auto" }}
                onClick={handleEditClick}
              >
                <FontAwesomeIcon icon={faPenToSquare} /> แก้ไข
              </button>
            </div>
            {listingData.update_on ? (
              <div className="header__btn">
                <p
                  className="container__address"
                  style={{ color: "#b2b2b2", textAlign: "right" }}
                >
                  แก้ไขล่าสุด
                  <br />
                  {listingData.update_on} | {listingData.update_at} |{" "}
                  {updateBy}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="container__input" style={{ paddingTop: "10px" }}>
            <div className="input--icon">
              {listingData.type === "CD" || listingData.type === "CB" ? (
                <FontAwesomeIcon icon={faBuilding} size="xl" />
              ) : listingData.type === "L" ? (
                <FontAwesomeIcon icon={faKaaba} size="xl" />
              ) : (
                <FontAwesomeIcon icon={faHouse} size="xl" />
              )}
            </div>
            <div className="input--name">
              <div className="name--disbled">{listingData.name}</div>
              <div className="price--disbled">{formatPrice(listingData.price)}</div>
            </div>
          </div>
          <div className="container__address">
            <p className="address--text">{listingData.address || "-"}</p>
            <p className="address--baht">บาท</p>
          </div>
          <div className="container__desc">
            <div className="container__visual">
              <div className="desc__pic">
                <input type="file" className="image-upload" accept="image/*" />
              </div>
              <div className="desc__map">
                <APIProvider
                  apiKey={googleAPI}
                  solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                >
                  <Map
                    mapId={"7ef4f9d66b6db69f"}
                    defaultZoom={13}
                    defaultCenter={{
                      lat: listingData.lat,
                      lng: listingData.lng,
                    }}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                  >
                    <AdvancedMarker
                      key={listing_id}
                      position={{ lat: listingData.lat, lng: listingData.lng }}
                    >
                      <div
                        className={`custom__marker ${
                          listingData.tradetype === "เช่า"
                            ? "marker--rent"
                            : "marker--sell"
                        }`}
                      />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              </div>
            </div>
            <div className="container__details">
              <p className="detials__header">รายละเอียดรายการ</p>
              <div className="details__container">
                <p className="container--text">เลขที่บ้าน/ห้อง/ตึก (ถ้ามี):</p>
                <div id="input--disabled">{listingData.number}</div>
              </div>
              <hr />
              <div className="details__container">
                <p className="container--text">ประเภท:</p>
                <div id="input--disabled">{typeConvert(listingData.type)}</div>
              </div>
              <hr />
              <div className="details__container">
                <p className="container--text">ห้องนอน:</p>
                <div id="input--disabled">{listingData.bedroom}</div>
              </div>
              <hr />
              <div className="details__container">
                <p className="container--text">ห้องน้ำ:</p>
                <div id="input--disabled">{listingData.bathroom}</div>
              </div>
              <hr />
              <div className="details__container">
                <p className="container--text">พื้นที่รวม:</p>
                <div className="container--area--disabled">
                  <div id="input--disabled">{listingData.area} ตรม.</div>
                </div>
              </div>
              <hr />
              <div className="details__container">
                <p className="container--text">ผู้รับผิดชอบโครงการ:</p>
                <div id="input--disabled">{owner}</div>
              </div>
              <hr />
              <div className="details__container--note">
                <p className="container--text">ข้อมูลเพิ่มเติม:</p>
                <div id="note--disbled">{listingData.note || "-"}</div>
                <hr />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Property;
