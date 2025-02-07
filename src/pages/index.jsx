import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faKaaba } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/index.css";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import ListingList from "../components/listingList";
import supabase from "../components/supabaseClient";
import googleAPI from "../components/googleAPI";

const Home = () => {
  const filterIcon = <FontAwesomeIcon icon={faSliders} size="md" />;
  const condoIcon = <FontAwesomeIcon icon={faBuilding} size="sm" />;
  const houseIcon = <FontAwesomeIcon icon={faHouse} size="sm" />;
  const landIcon = <FontAwesomeIcon icon={faKaaba} size="sm" />
  const priceIcon = <FontAwesomeIcon icon={faTag} size="sm" />
  const [keyword, setKeyword] = useState("");
  const [listings, setListings] = useState([]);
  const [hoveredListing, setHoveredListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  // const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("listing_id, name, lat, lng, tradetype, price, type");

    if (error) {
      console.error("Error fetching listings: ", error.message);
      return;
    }

    setListings(data);
  }

  const formatCompactNumber = (number) => {
    if (number < 1000) {
      return number;
    } else if (number >= 1000 && number < 1_000_000) {
      return number / 1000 + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
      return number / 1_000_000 + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
      return number / 1_000_000_000 + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
      return number / 1_000_000_000_000 + "T";
    }
  };

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
      <div className="search">
        <form onSubmit={handleSearch}>
          <input
            className="search__input"
            name="keyword"
            placeholder="ค้นหาด้วยคีย์เวิร์ด"
            value={keyword}
            onChange={handleChange}
          />
          <button type="submit" className="search__btn">
            ค้นหา
          </button>
        </form>
        <button type="button" className="search__filter" onClick={handleFilter}>
          {filterIcon}
          <p>ตัวกรอง</p>
        </button>
      </div>
      <div className="container">
        <div className="container__map">
          <APIProvider
            apiKey={googleAPI}
            language="th"
          >
            <Map
              mapId="7ef4f9d66b6db69f"
              defaultZoom={13}
              defaultCenter={{
                lat: 13.705242300007146,
                lng: 100.63543752886405,
              }}
              onClick={() => {
                setSelectedListing(null);
              }}
            >
              {listings.map((listing) => (
                <React.Fragment key={listing.listing_id}>
                  <AdvancedMarker
                    key={listing.listing_id}
                    position={{ lat: listing.lat, lng: listing.lng }}
                    onMouseEnter={() => setHoveredListing(listing.listing_id)}
                    onMouseLeave={() => setHoveredListing(null)}
                    onClick={() => setSelectedListing(listing.listing_id)}
                  >
                    <div
                      className={`custom__marker ${
                        listing.tradetype === "เช่า"
                          ? "marker--rent"
                          : "marker--sell"
                      }`}
                    >
                      {hoveredListing === listing.listing_id && (
                        <div className="marker--label">
                          <p className="label--header">
                            {listing.type === 'CD' || listing.type === 'CB' 
                              ? condoIcon 
                              : listing.type === 'L' 
                              ? landIcon 
                              : houseIcon} {listing.name}
                          </p>
                          <p className="label--price">
                          {priceIcon} {formatCompactNumber(listing.price)} บาท
                          </p>
                        </div>
                      )}
                    </div>
                  </AdvancedMarker>
                </React.Fragment>
              ))}
            </Map>
          </APIProvider>
        </div>
        <div className="container__listing">
          <ListingList selectedListing={selectedListing} />
        </div>
      </div>
    </>
  );
};

export default Home;
