import React, { useEffect, useState } from 'react';
import axios from 'axios';

const List = () => {
  const [apartmentList, setApartmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedSquareFeet, setSelectedSquareFeet] = useState('');

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/lists');
        setApartmentList(response.data.data || []);
      } catch (error) {
        console.error('Error fetching apartment list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const uniquePlaces = [...new Set(apartmentList.map(apt => apt.place))];
  const uniqueBuildings = [...new Set(apartmentList.map(apt => apt.building))];
  const uniqueSquareFeet = [...new Set(apartmentList.map(apt => apt.square_feet))];

  // Filter if ANY selected value matches
  const filteredApartments = apartmentList.filter((apt) => {
    return (
      (selectedPlace && apt.place === selectedPlace) ||
      (selectedBuilding && apt.building === selectedBuilding) ||
      (selectedSquareFeet && apt.square_feet === selectedSquareFeet)
    );
  });

  return (
    <div className="mt-24 p-6 max-w-3xl mx-auto">
      {/* Filter Dropdowns */}
      <div className="bg-red-200 p-6 rounded shadow mb-6 space-y-4">
        <div>
          <label htmlFor="place" className="block mb-1 font-medium">Choose a Place:</label>
          <select
            id="place"
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select a Place --</option>
            {uniquePlaces.map((place, idx) => (
              <option key={idx} value={place}>{place}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="building" className="block mb-1 font-medium">Choose a Building:</label>
          <select
            id="building"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select a Building --</option>
            {uniqueBuildings.map((building, idx) => (
              <option key={idx} value={building}>{building}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="squarefeet" className="block mb-1 font-medium">Choose Square Feet:</label>
          <select
            id="squarefeet"
            value={selectedSquareFeet}
            onChange={(e) => setSelectedSquareFeet(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select Square Feet --</option>
            {uniqueSquareFeet.map((sqft, idx) => (
              <option key={idx} value={sqft}>{sqft}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtered Results */}
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <p>Loading apartments...</p>
        ) : (
          <>
            {filteredApartments.length > 0 ? (
              <ul className="space-y-4">
                {filteredApartments.map((item) => (
                  <li key={item.id} className="border p-4 rounded bg-gray-50">
                    <p><strong>Place:</strong> {item.place}</p>
                    <p><strong>Building:</strong> {item.building}</p>
                    <p><strong>Square Feet:</strong> {item.square_feet}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No apartment matches your filters.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default List;
