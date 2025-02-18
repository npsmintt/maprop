import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faBuilding, faHouse, faKaaba, faTag } from "@fortawesome/free-solid-svg-icons";
import "@fontsource/noto-sans-thai/800.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/400.css";
import "../css/index.css";
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import ListingList from "../components/listingList";
import Filter from "../components/filter";
import supabase from "../components/supabaseClient";
import googleAPI from "../components/googleAPI";
import Popup from "reactjs-popup";
import PlaceAutocomplete from "../components/autocomplete";


const Home = () => {
  const filterIcon = <FontAwesomeIcon icon={faSliders} size="md" />;
  const condoIcon = <FontAwesomeIcon icon={faBuilding} size="sm" />;
  const houseIcon = <FontAwesomeIcon icon={faHouse} size="sm" />;
  const landIcon = <FontAwesomeIcon icon={faKaaba} size="sm" />;
  const priceIcon = <FontAwesomeIcon icon={faTag} size="sm" />;
  const [inputValue, setInputValue] = useState("");
  const [listings, setListings] = useState([]);
  const [hoveredListing, setHoveredListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [filters, setFilters] = useState({
    typeFilter: [],
    tradeType: ["ขาย", "เช่า"],
    owner: "",
    status: ["Active"],
    priceFrom: "",
    priceTo: "",
    bedroom: null,
    bathroom: null,
    pet: ["yes", "no", null],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  
  useEffect(() => {
    fetchListings();
  }, [filters]);

  async function fetchListings() {
    let query = supabase
      .from("listings")
      .select("listing_id, name, lat, lng, tradetype, price, type, status");

    if (filters.typeFilter?.length > 0) {
      query = query.in("type", filters.typeFilter);
    }
    if (filters.tradeType?.length > 0) {
      query = query.in("tradetype", filters.tradeType);
    }
    if (filters.owner) {
      query = query.eq("salesperson", filters.owner);
    }
    if (filters.status) {
      query = query.in("status", filters.status);
    }
    if (filters.priceFrom) {
      query = query.gte("price", filters.priceFrom);
    }
    if (filters.priceTo) {
      query = query.lte("price", filters.priceTo);
    }
    if (filters.pet && filters.pet.length > 0) {
      if (filters.pet.length === 3) {
        query = query.or('pet.eq.yes,pet.eq.no,pet.is.null');
      } else if (filters.pet.length === 1 && filters.pet[0] === "yes") {
        query = query.eq("pet", "yes");
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching listings: ", error.message);
      return;
    }

    setListings(data);
  }

  const MapLoader = ({ setMapInstance }) => {
    const map = useMap();
  
    useEffect(() => {
      if (map) {
        setMapInstance(map);
      }
    }, [map]);
  
    return null; // No UI needed
  };

  const formatCompactNumber = (number) => {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1_000_000) {
      return (number / 1000).toFixed(1) + "K";
    } else if (number < 1_000_000_000) {
      return (number / 1_000_000).toFixed(1) + "M";
    } else if (number < 1_000_000_000_000) {
      return (number / 1_000_000_000).toFixed(1) + "B";
    } else {
      return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
  };

  const handlePlaceSelect = (place) => {
    setInputValue(place.name);
    fetchListings();

    if (!mapInstance) {
      console.warn("⛔ Map is not ready yet!");
      return;
    }
    mapInstance.panTo({ lat: place.lat, lng: place.lng });
    mapInstance.setZoom(15);
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

  return (
    <>
      <div className="search">
        <APIProvider
          apiKey={googleAPI}
          solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
          language="th"
        >
          <PlaceAutocomplete className="search__input" onPlaceSelect={handlePlaceSelect} />
        </APIProvider>
        <button
          type="button"
          className="search__filter"
          onClick={() => setIsFilterOpen(true)}
        >
          {filterIcon}
          <p>ตัวกรอง</p>
        </button>
        {isFilterOpen && (
          <Popup
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            modal
          >
            <Filter
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => {
                setFilters(newFilters);
                setIsFilterOpen(false);
              }}
              defaultFilters={filters}
            />
          </Popup>
        )}
      </div>
      <div className="container">
        <div className="container__map">
          <APIProvider
            apiKey={googleAPI}
            solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
            language="th">
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
              <MapLoader setMapInstance={setMapInstance} />
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
                        listing.type === "CB"
                          ? "marker--CB"
                          : listing.type === "CD"
                          ? "marker--CD"
                          : listing.type === "DH"
                          ? "marker--DH"
                          : listing.type === "L"
                          ? "marker--L"
                          : listing.type === "TH"
                          ? "marker--TH"
                          : "marker--TW"
                      }`}
                    >
                      {hoveredListing === listing.listing_id && (
                        <div className="marker--label">
                          <p className="label--header">
                            {listing.name}
                          </p>
                          <p className="label--details">
                            {listing.type === "CD" || listing.type === "CB"
                                ? condoIcon
                                : listing.type === "L"
                                ? landIcon
                                : houseIcon}{" "} 
                            {typeConvert(listing.type)}
                          </p>
                          <p className="label--price">
                            {priceIcon} {formatCompactNumber(listing.price)}
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
          <ListingList listings={listings} selectedListing={selectedListing} />
        </div>
      </div>
    </>
  );
};

export default Home;
