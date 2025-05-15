import React, { useEffect, useState } from 'react';
import { fetchApartmentList } from '../../services/listService';
import image from '../../assets/image/one.jpg'; // fallback image

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
        console.log('Apartment list', data);
      } catch (error) {
        console.error('Failed to fetch apartment list:', error);
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
      (!selectedPlace || apt.place === selectedPlace) &&
      (!selectedBuilding || apt.building === selectedBuilding) &&
      (!selectedSquareFeet || apt.square_feet === selectedSquareFeet)
    );
  });

  return (
    <>
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

            </ul>
          ) : (
            <p>No apartment matches your filters.</p>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <p>Loading apartments...</p>
        ) : filteredApartments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApartments.map((item) => (
              <div
                key={item.id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700"
              >
                <a href="#">
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={item.image || image}
                    alt={`${item.place} apartment`}
                  />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.title || 'No Title'}
                    </h5>
                  </a>
                  <p className="mb-2 text-2lg font-normal text-gray-700 dark:text-gray-400">
                    {item.place}
                  </p>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>Size:</strong> {item.square_feet} sq ft
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    View More
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No apartment matches your filters.</p>
        )}
      </div>
    </>
  );
};

// Dropdown component placed at the end
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
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default List;
