import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const ListingList = () => {
    const priceIcon = <FontAwesomeIcon icon={faTag} size="sm" />;
    const [listing, setListing] = useState([]);

    useEffect(() => {
        console.log("Fetching listings...");
        getListing();
    }, []);

    async function getListing() {
        const { data, error } = await supabase.from("listings").select();

        if (error) {
            console.error("Error fetching listings:", error.message);
            return;
        }

        setListing(data);
    }

    return (
        <>
        <div className="listingPic">photo</div>

            <ul>
                {listing.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>

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
        </>
    );
};

export default ListingList;