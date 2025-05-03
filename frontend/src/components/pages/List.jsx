import React, { useEffect, useState } from 'react';
import { fetchApartmentList } from '../../services/listService';

const List = () => {
  const [apartmentList, setApartmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedSquareFeet, setSelectedSquareFeet] = useState('');

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await fetchApartmentList();
        setApartmentList(data);
      } catch (error) {
        // Already logged inside service
      } finally {
        setLoading(false);
      }
    };

    loadApartments();
  }, []);

  const uniquePlaces = [...new Set(apartmentList.map((apt) => apt.place))];
  const uniqueBuildings = [...new Set(apartmentList.map((apt) => apt.building))];
  const uniqueSquareFeet = [...new Set(apartmentList.map((apt) => apt.square_feet))];

  const filteredApartments = apartmentList.filter((apt) => {
    return (
      (selectedPlace && apt.place === selectedPlace) ||
      (selectedBuilding && apt.building === selectedBuilding) ||
      (selectedSquareFeet && apt.square_feet === selectedSquareFeet)
    );
  });

  return (
    <div className="mt-24 p-6 max-w-3xl mx-auto">
      {/* Filters */}
      <div className="bg-red-200 p-6 rounded shadow mb-6 space-y-4">
        <Dropdown
          label="Choose a Place:"
          value={selectedPlace}
          onChange={setSelectedPlace}
          options={uniquePlaces}
        />
        <Dropdown
          label="Choose a Building:"
          value={selectedBuilding}
          onChange={setSelectedBuilding}
          options={uniqueBuildings}
        />
        <Dropdown
          label="Choose Square Feet:"
          value={selectedSquareFeet}
          onChange={setSelectedSquareFeet}
          options={uniqueSquareFeet}
        />
      </div>

      {/* Results */}
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <p>Loading apartments...</p>
        ) : filteredApartments.length > 0 ? (
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
      </div>
    </div>
  );
};

// Dropdown Component
const Dropdown = ({ label, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 w-full"
    >
      <option value="">-- Select --</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default List;
