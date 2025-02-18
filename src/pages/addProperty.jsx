import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../css/addProperty.css";
import "../css/filter.css";
import supabase from "../components/supabaseClient"
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import googleAPI from "../components/googleAPI";
import PlaceAutocomplete from "../components/autocomplete";

const AddProperty = () => {
  const trashIcon = <FontAwesomeIcon icon={faTrash} />;
  const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} />;
  const pinIcon = <FontAwesomeIcon icon={faLocationDot} size="xl"/>
  const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/>
  const navigate = useNavigate();
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
  const [pet, setPet] = useState("no");

  useEffect(() => {
          console.log("Fetching salesperson...");
          getSalesName();
      }, []);

  // saleperson list for select options
  async function getSalesName() {
    const { data, error } = await supabase
      .from("salesperson")
      .select("sales_id, nickname");

    if (error) {
      console.error("Error fetching salesperson: ", error.message);
      return;
    }

    setSalesperson(data);
  };

  const generateListingId = async (salespersonId, tradeType) => {
    const {data: salesData, error: salesError } = await supabase
    .from("salesperson")
    .select("sales_id")
    .eq("sales_id", salespersonId)
    .single();

    if (salesError || !salesData) {
      console.error("Error fetching salesperson:", salesError?.message);
      return null;
    }

    const salesId = salesData.sales_id;
    const match = salesId.match(/\[([A-Z]+)\]/);
    if (!match || !match[1]) {
      console.error("Invalid sales_id format: ", salesId);
      return null;
    }

    const salesPrefix = match[1];
    const year = new Date().getFullYear().toString().slice(-2);
    const tradeCode = tradeType === "ขาย" ? "S" : "R";

    const { data: listings, error: listError } = await supabase
    .from("listings")
    .select("listing_id")
    .like("listing_id", `${salesPrefix}${year}${tradeCode}-%`)
    .order("listing_id", { ascending: false })
    .limit(1);

    if (listError) {
      console.error("Error fetching latest listing ID", listError.message);
      return null;
    }

    let nextNumber = 1;
    if (listings.length > 0) {
      const lastListingId = listings[0].listing_id;
      const lastNumber = parseInt(lastListingId.split("-")[1], 10);
      nextNumber= lastNumber + 1;
    }

    const formattedNumber = String(nextNumber).padStart(3, "0");
    return `${salesPrefix}${year}${tradeCode}-${formattedNumber}`;
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
    return parseFloat(str.replace(/,/g, ""));
  }

  const MapHandler = ({ place, marker }) => {
    const map = useMap();
  
    useEffect(() => {
      if (!map || !place || !marker) return;
  
      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry?.viewport);
      }
  
      marker.position = place.geometry?.location;
    }, [map, place, marker]);
    return null;
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    if (place.lat && place.lng) {
      setLat(place.lat);
      setLng(place.lng);
      setPlaceName(place.name);
      setPlaceAddress(place.formatted_address || "");
    }
  };

  const handleCancel = (event) => {
    navigate("/");
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    if (!placeName || !price || !salesperson || !type || !owner || !lat || !lng) {
      console.log("name:", placeName,
                  "price:", price,
                  "type:", type, 
                  "number", houseNumber,
                  "bedroom:", bedroom,
                  "bathroom:", bathroom,
                  "area:", area,
                  "owner:", owner,
                  "note:", note,
                  "lat:", lat,
                  "lng:", lng,
                  "pet:", pet)
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newListingId = await generateListingId(owner, tradeType);
    if (!newListingId) {
      alert("เกิดข้อผิดพลาด: Listing ID");
      return;
    }

    try {
      const { error } = await supabase.from("listings").insert([
        {
          listing_id: newListingId,
          name: placeName,
          address: placeAddress,
          type: type,
          number: houseNumber,
          price: stringToNumber(price),
          salesperson: owner,
          bedroom: bedroom,
          bathroom: bathroom,
          area: area,
          lat,
          lng, 
          tradetype: tradeType,
          status,
          note: note,
          created_at: new Date().toISOString(),
          update_by: owner,
          pet: pet,
        },
      ]);

      console.log("name:", placeName,
        "price:", price,
        "type:", type, 
        "number", houseNumber,
        "bedroom:", bedroom,
        "bathroom:", bathroom,
        "area:", area,
        "owner:", owner,
        "note:", note,
        "lat:", lat,
        "lng:", lng,
        "pet:", pet)

      if (error) {
        console.error("Error saving property:", error.message);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } else {
        alert("ข้อมูลถูกบันทึกสำเร็จ");
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("เกิดข้อผิดพลาดบางประการ");
    }
  };

  return (
    <>
      <div className="addProperty_container">
        <form className="container__form" onSubmit={handleAdd} autoComplete="off">
          <div className="container__header">
            <div className="header__select">
              <select 
                name="status" 
                className={`select--status ${status === "Active" ? "status--active" : "status--inactive"}`} 
                value={status}
                onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select 
                name="tradeType" 
                className={`select--tradeType ${tradeType === "เช่า" ? "trade--renting" : "trade--selling"}`} 
                value={tradeType}
                onChange={(e) => setTradeType(e.target.value)}>
                <option value="เช่า">เช่า</option>
                <option value="ขาย">ขาย</option>
              </select>
            </div>
            <div className="header__btn">
              <button
                type="button"
                className="btn--delete"
                onClick={handleCancel}>
                {trashIcon} ลบรายการ
              </button>
              <button type="submit" className="btn--add">
                {saveIcon} บันทึก
              </button>
            </div>
          </div>
            <div className="container__input">
              <div className="input--icon">{pinIcon}</div>
              <APIProvider
                apiKey={googleAPI}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                language="th"
              >
                <div className="input--name">
                  <PlaceAutocomplete className="name--input" onPlaceSelect={handlePlaceSelect} />
                  <button className="name--btn" disabled>{searchIcon}</button>
                </div>
              </APIProvider>
              <input
                  className="input--price"
                  placeholder="ราคา"
                  value={price ? numberWithCommas(price) : ""}
                  onChange={(e) => setPrice(e.target.value)}
                />
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
                  solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                >
                  <Map
                      mapId={"7ef4f9d66b6db69f"}
                      defaultZoom={15}
                      defaultCenter={{ lat , lng }}
                      gestureHandling={"greedy"}
                      disableDefaultUI={true}
                  >
                      <AdvancedMarker ref={markerRef} position={null}>
                      <div
                      className={`custom__marker ${
                        type === "CB"
                          ? "marker--CB"
                          : type === "CD"
                          ? "marker--CD"
                          : type === "DH"
                          ? "marker--DH"
                          : type === "L"
                          ? "marker--L"
                          : type === "TH"
                          ? "marker--TH"
                          : "marker--TW"
                      }`} />
                      </AdvancedMarker>
                  </Map>
                  <MapHandler place={selectedPlace} marker={marker} />
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
                  onChange={(e) => setHouseNumber(e.target.value)}/>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">ประเภท:</p>
                  <select 
                    name="type" 
                    id="container--input" 
                    defaultValue={""}
                    onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled>กรุณาเลือก</option>
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
                  onChange={(e) => setBedroom(e.target.value)}/>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">ห้องน้ำ:</p>
                  <input 
                  id="container--input" 
                  type="number" 
                  min="0"
                  onChange={(e) => setBathroom(e.target.value)}/>
                </div>  
                <hr />
                <div className="details__container">
                  <p className="container--text">พื้นที่รวม:</p>
                  <div className="container--area">
                    <input 
                    id="container--input" 
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
                    defaultValue={""}
                    onChange={(e) => setOwner(e.target.value)}>
                    <option value="" disabled>กรุณาเลือก</option>
                    {salesperson.map((item) => (
                      <option key={item.sales_id} value={item.sales_id}>
                        {item.nickname}
                      </option>
                    ))}
                  </select>
                </div>  
                <hr />
                <div className="details__container--pet">
                  <label key={type.type_id} className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={pet === "yes"} 
                      onChange={(e) => setPet(e.target.checked ? "yes" : "no")} // Set pet to "yes" when checked, "no" when unchecked
                    />
                    <span className="checkmark">
                      <span className="inner-box"></span>
                    </span> 
                    <p className="container--text">เลี้ยงสัตว์ได้</p>
                  </label>
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

export default AddProperty;
