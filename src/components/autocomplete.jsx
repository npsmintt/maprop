import { useState, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const PlaceAutocomplete = ({ className, onPlaceSelect, initialValue }) => {
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

  useEffect(() => {
        const handleKeyDown = async (e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevents form submission
            
            if (!places || !inputRef.current) return;
      
            const service = new places.AutocompleteService();
            service.getPlacePredictions(
              { input: inputValue, types: ["geocode"] }, // Get place predictions
              (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions.length > 0) {
                  const firstPrediction = predictions[0]; // Take first prediction
      
                  // Fetch place details
                  const detailsService = new places.PlacesService(document.createElement("div"));
                  detailsService.getDetails(
                    { placeId: firstPrediction.place_id, fields: ["geometry", "name", "formatted_address"] },
                    (place, status) => {
                      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
        
                        // Update input value with the selected place's name
                        setInputValue(place.name);
      
                        // Pass place data to parent
                        onPlaceSelect({ ...place, lat, lng });
                      } else {
                        console.warn("⛔ No valid location found, try selecting from the dropdown.");
                      }
                    }
                  );
                } else {
                  console.warn("⛔ No predictions found for input:", inputValue);
                }
              }
            );
          }
        };
      
        const inputElement = inputRef.current;
        if (inputElement) {
          inputElement.addEventListener("keydown", handleKeyDown);
        }
      
        return () => {
          if (inputElement) {
            inputElement.removeEventListener("keydown", handleKeyDown);
          }
        };
      }, [inputValue, places, onPlaceSelect]);

  return (
    <input 
    className={className}
    placeholder="ค้นหาสถานที่"
    value = {inputValue}
    ref={inputRef}
    onChange={(e) => setInputValue(e.target.value)} />
  );
};

export default PlaceAutocomplete;