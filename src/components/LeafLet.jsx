import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LeafLet = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [toggleState, setToggleState] = useState({});

  const originalPlaces = [
    { name: 'TVK Farms' },
    { name: 'Anbu Dairy' },
    { name: 'Kavya' },
    { name: 'Sundari' },
    { name: 'Green Leaf Agro' },
    { name: 'Mahalakshmi Farms' },
    { name: 'Devi Poultry' },
    { name: 'Prakash' },
    { name: 'Ravi Agrotech' },
    { name: 'Selvi' },
    { name: 'Jaya Farms' },
    { name: 'Lakshmi Agro' },
    { name: 'Vetri Farm House' },
    { name: 'Rajendran' },
    { name: 'Kalaivani' },
    { name: 'Shanthi Farmstead' },
    { name: 'Thanjai Naturals' },
    { name: 'Banu' },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLoc = [latitude, longitude];
        setUserLocation(currentLoc);

        const adjustedPlaces = originalPlaces.map((place) => {
          const latOffset = (Math.random() - 0.5) * 0.05;
          const lngOffset = (Math.random() - 0.5) * 0.05;
          return {
            name: place.name,
            lat: latitude + latOffset,
            lng: longitude + lngOffset,
          };
        });

        const allPlaces = [
          ...adjustedPlaces,
          { name: 'Lingesh (You)', lat: latitude, lng: longitude },
        ];

        const nearby = allPlaces
          .map((place) => ({
            ...place,
            distance: getDistance(latitude, longitude, place.lat, place.lng),
          }))
          .filter((place) => place.distance <= 20)
          .sort((a, b) => a.distance - b.distance);

        setNearbyPlaces(nearby);
      },
      (error) => {
        console.error('Error getting location:', error);
        const fallbackLat = 11.019;
        const fallbackLng = 76.958;
        setUserLocation([fallbackLat, fallbackLng]);

        const adjustedPlaces = originalPlaces.map((place) => {
          const latOffset = (Math.random() - 0.5) * 0.05;
          const lngOffset = (Math.random() - 0.5) * 0.05;
          return {
            name: place.name,
            lat: fallbackLat + latOffset,
            lng: fallbackLng + lngOffset,
          };
        });

        const allPlaces = [
          ...adjustedPlaces,
          { name: 'Lingesh (You)', lat: fallbackLat, lng: fallbackLng },
        ];

        const nearby = allPlaces
          .map((place) => ({
            ...place,
            distance: getDistance(fallbackLat, fallbackLng, place.lat, place.lng),
          }))
          .filter((place) => place.distance <= 20)
          .sort((a, b) => a.distance - b.distance);

        setNearbyPlaces(nearby);
      }
    );
  }, []);

  const handleToggle = (name) => {
    setToggleState((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={userLocation || [11.019, 76.958]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {userLocation && (
          <>
            <ChangeMapCenter center={userLocation} />
            <Marker position={userLocation}>
              <Popup>Your location 📍</Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={5000}
              pathOptions={{ color: 'green', fillColor: 'lightgreen', fillOpacity: 0.2 }}
            />
          </>
        )}

        {nearbyPlaces.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lng]}>
            <Popup>
              <div>
                {place.name}
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input
                    type="checkbox"
                    checked={toggleState[place.name] || false}
                    onChange={() => handleToggle(place.name)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#ccc',
                      transition: '.4s',
                      borderRadius: '34px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '',
                        height: '26px',
                        width: '26px',
                        left: '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        transition: '.4s',
                        borderRadius: '50%',
                        transform: toggleState[place.name] ? 'translateX(26px)' : 'none',
                      }}
                    ></span>
                  </span>
                </label>
                <br />
                {place.distance.toFixed(2)} km away
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafLet;
