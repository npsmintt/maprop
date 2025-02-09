import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,
        faFloppyDisk,
        faLocationDot,
        faMagnifyingGlass, 
        faBuilding,
        faHouse,
        faKaaba
 } from "@fortawesome/free-solid-svg-icons";
import "../css/addProperty.css";
import supabase from "../components/supabaseClient"
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

const EditProperty = () => {
    const { listing_id } = useParams();
    const navigate = useNavigate();
    const [listingData, setListingData] = useState(null);

    const trashIcon = <FontAwesomeIcon icon={faTrash} />;
    const pinIcon = <FontAwesomeIcon icon={faLocationDot} size="xl"/>
    const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/>
    
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeAddress, setPlaceAddress] = useState("");
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [salesperson, setSalesperson] = useState([]);
    // States for store new data
    const [status, setStatus] = useState("Active");
    const [tradeType, setTradeType] = useState("เช่า");
    const [placeName, setPlaceName] = useState("");
    const [price, setPrice] = useState(0);
    const [type, setType] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [bedroom, setBedroom] = useState(0);
    const [bathroom, setBathroom] = useState(0);
    const [area, setArea] = useState(0);
    const [owner, setOwner] = useState("");
    const [note, setNote] = useState("");
    const [lat, setLat] = useState(13.7052423);
    const [lng, setLng] = useState(100.6354375);

  useEffect(() => {
    fetchProperty();
    getSalesName();
  }, [listing_id]);

  const getSalesName = async () => {
    const { data, error } = await supabase
    .from("salesperson")
    .select("sales_id, nickname");

    if (error) {
        console.error("Error fetching salesperson: ", error.message);
        return;
    }

    setSalesperson(data);
  };

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
      setStatus(data.status);
      setTradeType(data.tradetype);
      setPlaceName(data.name);
      setPlaceAddress(data.address)
      setPrice(data.price);
      setType(data.type);
      setHouseNumber(data.number);
      setBedroom(data.bedroom);
      setBathroom(data.bathroom);
      setArea(data.area);
      setOwner(data.salesperson);
      setNote(data.note);
      setLat(data.lat);
      setLng(data.lng);
    }
  };

  function numberWithCommas(x) {
    if (!x) return ""; 

    x = x.toString().replace(/[^\d.]/g, "");

    let parts = x.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.length > 1 ? parts.join(".") : parts[0];
  }

  function stringToNumber(str) {
    if (!str) return 0;
  
    return parseFloat(String(str).replace(/,/g, ""));
  }

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    if (place.lat && place.lng) {
      setLat(place.lat);
      setLng(place.lng);
      setPlaceName(place.name);
      setPlaceAddress(place.formatted_address || "");
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("listing_id", listing_id);

    if (error) {
      console.error("Error updating property:", error.message);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } else {
      alert("ลบรายการสำเร็จ");
      navigate(`/`);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from("listings")
      .update({
        name: placeName,
        address: placeAddress,
        type: type,
        number: houseNumber,
        price: stringToNumber(price),
        salesperson: owner,
        bedroom: bedroom,
        bathroom: bathroom,
        area: area,
        lat: lat,
        lng: lng, 
        tradetype: tradeType,
        status: status,
        note: note,
        created_at: new Date().toISOString(),
        update_on: new Date().toISOString().split("T")[0],
        update_at: new Date().toTimeString().split(" ")[0],
        update_by: owner,
      })
      .eq("listing_id", listing_id);

    if (error) {
      console.error("Error updating property:", error.message);
      alert("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } else {
      alert("แก้ไขรายการสำเร็จ");
      navigate(`/property/${listing_id}`);
    }
  };

  if (!listingData) return <p>Loading...</p>;

  return (
    <>
      <div className="addProperty_container">
        <form className="container__form" onSubmit={handleSave}>
          <div className="container__header">
            <div className="header__select">
              <select
                name="status"
                value={status}
                className={`select--status ${
                  status === "Active"
                    ? "status--active"
                    : "status--inactive"
                }`}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                name="tradeType"
                value={tradeType}
                className={`select--tradeType ${
                  tradeType === "เช่า"
                    ? "trade--renting"
                    : "trade--selling"
                }`}
                onChange={(e) => setTradeType(e.target.value)}
              >
                <option value="เช่า">เช่า</option>
                <option value="ขาย">ขาย</option>
              </select>
            </div>
            <div className="header__btn">
            <button
                type="button"
                className="btn--delete"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash} /> ลบรายการ
              </button>
              <button
                type="submit" 
                className="btn--add"
                onClick={handleSave}
              >
                <FontAwesomeIcon icon={faFloppyDisk} /> บันทึก
              </button>
            </div>
          </div>
          <div className="container__address">
            <p className="address--text">Listing ID: {listingData.listing_id}</p>
          </div>
          <div className="container__input">
            <div className="input--icon">
              {type === 'CD' || type === 'CB' 
                    ? <FontAwesomeIcon icon={faBuilding} size="xl"/> 
                    : type === 'L' 
                    ? <FontAwesomeIcon icon={faKaaba} size="xl"/>
                    : <FontAwesomeIcon icon={faHouse} size="xl"/>}
            </div>
            <APIProvider
                apiKey={googleAPI}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                language="th">
                <div className="input--name">
                <PlaceAutocomplete 
                    onPlaceSelect={handlePlaceSelect} 
                    initialValue={placeName} 
                />
                  <button className="name--btn">{searchIcon}</button>
                </div>
            </APIProvider>
            <input
              className="input--price"
              placeholder="ราคา"
              value={price ? numberWithCommas(price) : ""}
              onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="container__address">
              <p className="address--text">{placeAddress || "-"}</p>
              <p className="address--baht">บาท</p>
          </div>
          <div className="container__desc">
            <div className="container__visual">
              <div className="desc__pic">
                <input type="file" 
                        className="image-upload" 
                        accept="image/*" />
              </div>
              <div className="desc__map">
              <APIProvider
                apiKey={googleAPI}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete">
              <Map
                  mapId={"7ef4f9d66b6db69f"}
                  defaultZoom={13}
                  center={{ lat, lng }}
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
              >
                  <AdvancedMarker 
                    key={listingData.listing_id}
                    position={{ lat, lng }}>
                  <div
                  className={`custom__marker ${
                    tradeType === "เช่า"
                      ? "marker--rent"
                      : "marker--sell"
                  }`} />
                  </AdvancedMarker>
              </Map>
              </APIProvider>
              </div>
            </div>
            <div className="container__details">
            <p className="detials__header">รายละเอียดรายการ</p>
                <div className="details__container">
                  <p className="container--text">เลขที่บ้าน/ห้อง/ตึก (ถ้ามี):</p>
                  <input 
                    id="container--input" 
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}/>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">ประเภท:</p>
                  <select 
                    name="type" 
                    id="container--input" 
                    defaultValue={type}
                    onChange={(e) => setType(e.target.value)}>
                    <option value="CD">คอนโด</option>
                    <option value="CB">อาคารพาณิชย์</option>
                    <option value="DH">บ้านเดี่ยว</option>
                    <option value="L">ที่ดิน</option>
                    <option value="TH">ทาวน์เฮ้าส์</option>
                    <option value="TW">บ้านแฝด</option>
                  </select>
                </div>
                <hr />
                <div className="details__container">
                  <p className="container--text">ห้องนอน:</p>
                  <input 
                  id="container--input" 
                  type="number"
                  min="0"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}/>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">ห้องน้ำ:</p>
                  <input 
                  id="container--input" 
                  type="number" 
                  min="0"
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}/>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">พื้นที่รวม:</p>
                  <div className="container--area">
                  <input 
                    id="container--input"
                    value={area} 
                    onChange={(e) => setArea(e.target.value)}/>
                    <p>ตรม.</p>
                  </div>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">ผู้รับผิดชอบโครงการ:</p>
                  <select 
                    name="salesperson" 
                    id="container--input" 
                    defaultValue={owner}
                    onChange={(e) => setOwner(e.target.value)}>
                    {salesperson.map((item) => (
                      <option key={item.sales_id} value={item.sales_id}>
                        {item.nickname}
                      </option>
                    ))}
                  </select>
                </div>  
                <hr />
                <div className="details__container--note">
                  <p className="container--text">ข้อมูลเพิ่มเติม:</p>
                  <textarea 
                    id="note--input" 
                    value={note}
                    placeholder="กรอกข้อมูลเพิ่มเติม (ถ้ามี)"
                    onChange={(e) => setNote(e.target.value)}/>
                </div>             
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

const PlaceAutocomplete = ({ onPlaceSelect, initialValue }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState(initialValue || "");
    const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setInputValue(place.name || "");

        // Pass lat and lng along with place
        onPlaceSelect({ ...place, lat, lng });
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  return (
    <input 
    className="name--input" 
    placeholder="ค้นหาสถานที่"
    value = {inputValue}
    ref={inputRef}
    onChange={(e) => setInputValue(e.target.value)} />
  );
};

export default EditProperty;
