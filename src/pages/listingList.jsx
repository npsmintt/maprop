import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@supabase/supabase-js";
import "../css/listingList.css";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
  );

const ListingList = ({ selectedListing }) => {
    const priceIcon = <FontAwesomeIcon icon={faTag} size="sm" />;
    const [listing, setListing] = useState([]);
    const [totalListing, setTotalListin] = useState(0);

    useEffect(() => {
        console.log("Fetching listings...");
        getListing();
    }, []);

    async function getListing() {
        const { data, error } = await supabase
            .from("listings")
            .select(`
                listing_id,
                name,
                price,
                bedroom,
                bathroom,
                tradetype,
                status,
                listingTypes:type (name)`)
            .order("name", {ascending: false});

        if (error) {
            console.error("Error fetching listings:", error.message);
            return;
        }

        const { count, error: countError } = await supabase
            .from("listings")
            .select("*", {count: "exact", head: true});
        
        if (countError) {
            console.error("Error fetching listing count: ", countError.message);
            return;
        }

        setListing(data);
        setTotalListin(count);
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <>
        <div className="listbox">
          <div className="listbox__header">
            <div>
              <p className="header--bold">รายชื่อรายการ</p>
              <p>({totalListing} รายการ)</p>
            </div>
            <div className="header--select">
              <label htmlFor="sorting">เรียงจาก</label>
              <div className="select-wrapper">
                <select name="sorting" id="select--sorting" defaultValue="pricelth">
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
        {listing.map((item) => (
            <div key={item.listing_id} className={`listbox__listing ${selectedListing === item.listing_id ? "listing--highlight" : ""}`}>
                <div className="listing--pic">photo</div>
                    <div className="listing">
                        <div className="desc--tagging">
                            <p className={`tagging--status ${item.status === "Active" ? "status--active" : "status--inactive"}`}>{item.status}</p>
                            <p className={`tagging--trade ${item.tradetype === "เช่า" ? "trade--renting" : "trade--selling"}`}>{item.tradetype}</p>
                        </div>
                    <p className="desc--name">{item.name}</p>
                    <p className="desc--id">ID: {item.listing_id}</p>
                    <p className="desc--type">{item.listingTypes?.name} | {item.bedroom ? item.bedroom : 0} ห้องนอน {item.bathroom ? item.bathroom : 0} ห้องน้ำ</p>
                    <p className="desc--price">{priceIcon} {formatPrice(item.price)} บาท</p>
                    </div>
            </div>
        ))}
        </div>
        </>
    );
};

export default ListingList;