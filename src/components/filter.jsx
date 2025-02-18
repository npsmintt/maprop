import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBed, faBath } from "@fortawesome/free-solid-svg-icons";
import "../css/filter.css";
import supabase from "./supabaseClient"

const Filter = ({ onClose, onApply, defaultFilters }) => {
    const [typeFilter, setTypeFilter] = useState([]);
    const [owner, setOwner] = useState("");
    const [types, setTypes] = useState([]);
    const [tradeType, setTradeType] = useState([]);
    const [salesperson, setSalesperson] = useState([]);
    const [status, setStatus] = useState(["Active"]);
    const [bedroom, setBedroom] = useState(null);
    const [bathroom, setBathroom] = useState(null);
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [pet, setPet] = useState(["yes", "no", null]);

    useEffect(() => {
        getSalesName();
        getTypes();
    }, []);

    useEffect(() => {
        if (!defaultFilters) return;
        setTypeFilter(defaultFilters.typeFilter || []);
        setTradeType(defaultFilters.TradeType || ["ขาย", "เช่า"]); 
        setOwner(defaultFilters.owner || "");
        setStatus(defaultFilters.status || ["Active"]);
        setBedroom(defaultFilters.bedroom || null);
        setBathroom(defaultFilters.bathroom || null);
        setPriceFrom(defaultFilters.priceFrom || "");
        setPriceTo(defaultFilters.priceTo || "");
        setPet(defaultFilters.pet || ["yes", "no", null]);
    }, [defaultFilters]);

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

    async function getTypes() {
        const { data, error } = await supabase
            .from("listingtypes")
            .select("type_id, name");
    
        if (error) {
            console.error("Error fetching listing types: ", error.message);
            return;
        }
    
        setTypes(data);
    };

    const toggleStatus = (selectedStatus) => {
        setStatus((prev) =>
            prev.includes(selectedStatus)
                ? prev.filter((s) => s !== selectedStatus)
                : [...prev, selectedStatus]
        );
    };

    const toggleTradeType = (selectedTradeType) => {
        setTradeType((prev) =>
            prev.includes(selectedTradeType)
                ? prev.filter((s) => s !== selectedTradeType)
                : [...prev, selectedTradeType]
        );
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

    const handleApply = (event) => {
        event.preventDefault();
        onApply({
            typeFilter: typeFilter.length ? typeFilter : [],
            tradeType: tradeType.length ? tradeType : [],
            owner: owner || "",
            status: status.length ? status : [],
            priceFrom: priceFrom ? stringToNumber(String(priceFrom)) : null,
            priceTo: priceTo ? stringToNumber(String(priceTo)) : null,
            bedroom: bedroom ? parseInt(bedroom, 10) : null,
            bathroom: bathroom ? parseInt(bathroom, 10) : null,
            pet: pet.length ? pet : [],
        });
        console.log(pet);
    };

    const handleClear = (event) => {
        event.preventDefault(); 
        setTypeFilter([]);
        setTradeType(["ขาย", "เช่า"]);
        setOwner("");
        setStatus(["Active"]);
        setBedroom(null);
        setBathroom(null);
        setPriceFrom("");
        setPriceTo("");
        setPet(["yes", "no", null]);
    };

    return (
        <>
        <div className="bigFilter_container">
        <div className="filter__header">
            <button className="btn--close" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} size="2xl"/>
            </button>
        </div>
        <div className="filter_container">
            <form className="container__form">
                <div className="filter__contents">
                    <div className="container__head reduceMargin">
                        <p>ประเภท</p>
                    </div>
                    <div className="container__flexbox">
                    {types.map((type) => (
                        <label key={type.type_id} className="custom-checkbox">
                            <input 
                                type="checkbox" 
                                checked={typeFilter.includes(type.type_id)}
                                value={type.type_id} 
                                onChange={(e) => {
                                    const selected = [...typeFilter];
                                    e.target.checked 
                                        ? selected.push(e.target.value) 
                                        : selected.splice(selected.indexOf(e.target.value), 1);
                                    setTypeFilter(selected);
                                }} 
                            />
                                <span className="checkmark">
                                    <span className="inner-box"></span>
                                </span> 
                                {type.name}
                        </label>
                    ))}
                    </div>
                </div>
                <div className="filter__contents">
                <div className="container__head reduceMargin">
                        <p>ขาย/เช่า</p>
                    </div>
                    <div className="status__container">
                        <button 
                            type="button"
                            className={`status--font ${tradeType.includes("ขาย") ? "trade--selling" : "status--unclicked"}`}
                            onClick={() => toggleTradeType("ขาย")}
                        >
                            ขาย
                        </button>
                        <button 
                            type="button"
                            className={`status--font ${tradeType.includes("เช่า") ? "trade--renting" : "status--unclicked"}`}
                            onClick={() => toggleTradeType("เช่า")}
                        >
                            เช่า
                        </button>
                    </div>
                </div>
                <div className="filter__contents">
                    <div className="container__head reduceMargin">
                        <p>จำนวนห้อง</p>
                    </div>
                    <div className="status__container">
                        <div className="room--desc"><FontAwesomeIcon icon={faBed} /></div>
                        <input
                            id="room--input"
                            type="number"
                            min="0"
                            value={bedroom}
                            onChange={(e) => setBedroom(e.target.value)}
                        />
                        <div className="room--desc"><FontAwesomeIcon icon={faBath} /></div>
                        <input
                            id="room--input"
                            type="number"
                            min="0"
                            value={bathroom}
                            onChange={(e) => setBathroom(e.target.value)}
                        />
                    </div>
                </div>
                <div className="filter__contents">
                <div className="container__head reduceMargin">
                    <p>ราคา</p>
                </div>
                <div className="price-range">
                    <input
                        id="price--input"
                        placeholder="จาก"
                        value={numberWithCommas(priceFrom)}
                        style={{ "marginRight": "10px" }}
                        onChange={(e) => setPriceFrom(e.target.value)}
                    />
                    <span> - </span>
                    <input
                        id="price--input"
                        placeholder="ถึง"
                        value={numberWithCommas(priceTo)}
                        style={{ "marginLeft": "10px" }}
                        onChange={(e) => setPriceTo(e.target.value)}
                    />
                    <p style={{ "marginLeft": "10px", "color": "#4B4B4B"
                     }}>บาท</p>
                </div>
                </div>
                <div className="filter__contents">
                    <div className="container__head reduceMargin">
                        <p>สถานะ</p>
                    </div>
                    <div className="status__container">
                        <button 
                            type="button"
                            className={`status--font ${status.includes("Active") ? "status--active" : "status--unclicked"}`}
                            onClick={() => toggleStatus("Active")}
                        >
                            Active
                        </button>
                        <button 
                            type="button"
                            className={`status--font ${status.includes("Inactive") ? "status--inactive" : "status--unclicked"}`}
                            onClick={() => toggleStatus("Inactive")}
                        >
                            Inactive
                        </button>
                    </div>
                </div>
                <div className="filter__contents">
                    <div className="container__head reduceMargin">
                        <p>ผู้รับผิดชอบโครงการ</p>
                    </div>
                    <select 
                        name="salesperson" 
                        id="container--input" 
                        value={owner ? owner : ""}
                        onChange={(e) => setOwner(e.target.value)}>
                        <option value="" disabled>กรุณาเลือก</option>
                        {salesperson.map((sp) => 
                            <option key={sp.sales_id} value={sp.sales_id}>
                                    {sp.nickname}
                            </option>
                        )}
                    </select>
                </div>
                <div className="filter__contents">
                <div className="container__head reduceMargin">
                    <p>ตัวเลือกพิเศษ</p>
                    </div>
                    <div className="status__container">
                    <button 
                        type="button"
                        className={`status--font ${pet.length === 1 && pet[0] === "yes" ? "specialOption--clicked" : "status--unclicked"}`}
                        onClick={() => {
                            if (pet.length === 1 && pet[0] === "yes") {
                                setPet(["yes", "no", null]); // Set to both "yes" and "no"
                            } else {
                                setPet(["yes"]); // Set to only "yes"
                            }
                        }}
                    >
                        เลี้ยงสัตว์ได้
                    </button>
                    </div>
                </div>
            </form>
        </div>
            <div className="container__btn">
                    <button className="clear__btn" 
                            onClick={handleClear}>
                        ล้างตัวกรอง
                    </button>
                    <button className="search__btn" 
                            onClick={handleApply}>
                        นำไปใช้
                    </button>
            </div>
        </div>
        </>
    );
};

export default Filter;