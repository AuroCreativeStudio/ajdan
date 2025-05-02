import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [apartmentList, setApartmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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
  
    // Filter the apartments based on search query and selected filters
    const filteredApartments = apartmentList.filter((apt) => {
      const matchesPlace = selectedPlace && apt.place === selectedPlace;
      const matchesBuilding = selectedBuilding && apt.building === selectedBuilding;
      const matchesSquareFeet = selectedSquareFeet && apt.square_feet === selectedSquareFeet;
      const matchesSearchQuery = searchQuery && 
        (apt.place.toLowerCase().includes(searchQuery.toLowerCase()) || 
        apt.building.toLowerCase().includes(searchQuery.toLowerCase()) || 
        apt.square_feet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.description.toLowerCase().includes(searchQuery.toLowerCase())); // You can add more fields as needed
  
      return (matchesPlace || matchesBuilding || matchesSquareFeet || matchesSearchQuery);
    });
  
    return (
      <div className="mt-24 p-6 max-w-3xl mx-auto">
        <form className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative w-full max-w-md ">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg> */}

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              required
            />
          
          </div>
        </form>
  
        {searchQuery && (
          <p className="mb-4 text-gray-700">
            Showing results for <strong>{searchQuery}</strong>
          </p>
        )}
  
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
  
  export default Search;
  