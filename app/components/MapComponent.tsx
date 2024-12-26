import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  onLocationSelect: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('Initializing map');
    const map = L.map(mapRef.current!).setView([51.505, -0.09], 13); // Default position

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Use OpenStreetMap's Nominatim API for reverse geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then((response) => response.json())
        .then((data) => {
          const address = data.display_name;
          onLocationSelect({ lat, lng, address });
        });
    });

    // Cleanup map on unmount
    return () => {
      console.log('Cleaning up map');
      map.remove();
    };
  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
