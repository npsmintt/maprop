import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import "../css/listingList.css";

const ListingList = ({ listings, selectedListing }) => {
    const priceIcon = <FontAwesomeIcon icon={faTag} size="sm" />;
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("pricelth");
    const listContainerRef = useRef(null);
    const listingRefs = useRef({});

    useEffect(() => {
        if (selectedListing && listingRefs.current[selectedListing]) {
            listingRefs.current[selectedListing].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedListing]);

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

    const sortedListings = [...listings].sort((a, b) => {
        switch (sortOption) {
            case "pricelth":
                return a.price - b.price;
            case "pricehtl":
                return b.price - a.price;
            case "areastb":
                return a.area || 0 - b.area || 0;
            case "areabts":
                return b.area || 0 - a.area || 0;
            default:
                return 0;
        }
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <>
        <div className="listbox">
          <div className="listbox__header">
            <div>
              <p className="header--bold">รายชื่อรายการ</p>
              <p className="header--count">({listings.length} รายการ)</p>
            </div>
            <div className="header--select">
              <label htmlFor="sorting">เรียงจาก</label>
              <div className="select-wrapper">
                <select 
                    name="sorting" 
                    id="select--sorting" 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}>
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
          <div className="listbox__scroll" ref={listContainerRef}>
            {sortedListings.map((item) => (
                <div 
                    key={item.listing_id}
                    ref={(el) => (listingRefs.current[item.listing_id] = el)}
                    className={`listbox__listing ${selectedListing === item.listing_id ? "listing--highlight" : ""}`}
                    onClick={() => navigate(`/property/${item.listing_id}`)}
                >
                    <div className="listing--pic">photo</div>
                        <div className="listing">
                            <div className="desc--tagging">
                                <p className={`tagging--status ${item.status === "Active" ? "status--active" : "status--inactive"}`}>{item.status}</p>
                                <p className={`tagging--trade ${item.tradetype === "เช่า" ? "trade--renting" : "trade--selling"}`}>{item.tradetype}</p>
                            </div>
                        <p className="desc--name">{item.name}</p>
                        <p className="desc--id">ID: {item.listing_id}</p>
                        <p className="desc--type">{typeConvert(item.type)} | {item.bedroom ? item.bedroom : 0} ห้องนอน {item.bathroom ? item.bathroom : 0} ห้องน้ำ</p>
                        <p className="desc--price">{priceIcon} {formatPrice(item.price)} บาท</p>
                        </div>
                </div>
            ))}
        </div>
        </div>
        </>
    );
};

export default ListingList;