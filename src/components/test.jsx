import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import googleAPI from "../components/googleAPI";

const AutocompleteBar = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  return (
    <APIProvider
      apiKey={googleAPI}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
        <div style={{ width: '100%', height: '500px' }}>
            <Map
                mapId={"7ef4f9d66b6db69f"}
                defaultZoom={3}
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
            >
                <AdvancedMarker ref={markerRef} position={null} />
            </Map>
        </div>
        <MapControl position={ControlPosition.TOP}>
            <div className="input--name">
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
            </div>
        </MapControl>
        <MapHandler place={selectedPlace} marker={marker} />
        </APIProvider>
    );
};

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

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
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
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);
  return (
    <input 
    className="name--input" 
    placeholder="ค้นหาสถานที่"
    ref={inputRef} />
  );
};

export default AutocompleteBar;