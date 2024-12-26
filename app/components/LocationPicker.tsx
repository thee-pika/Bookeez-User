"use client"

import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { toast } from 'react-toastify';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const LocationPicker: React.FC = () => {
  console.log('Rendering LocationPicker');
  const [location, setLocation] = useState<Location | null>(null);

  const handleLocationSelect = (location: Location) => {
    setLocation(location);
    toast.success('Location selected successfully!');
  };

  return (
    <div>
      <h2>Pick Your Location</h2>
      <MapComponent onLocationSelect={handleLocationSelect} />
      {location && (
        <div>
          <h3>Selected Location:</h3>
          <p>Address: {location.address}</p>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
