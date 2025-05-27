import React, { useEffect, useState } from 'react';
import { fetchApartmentList } from '../../services/listService';
import image from '../../assets/image/one.jpg'; // fallback image
import { Link, useLocation } from 'react-router-dom';

const List = () => {
  const [apartmentList, setApartmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedSquareFeet, setSelectedSquareFeet] = useState('');

  const location = useLocation();
  const match = location.pathname.match(/^\/(en|ar)(\/|$)/);
  const lang = match ? match[1] : 'en';

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await fetchApartmentList(lang);
        setApartmentList(data);
        console.log('Fetched apartments:', data);
      } catch (error) {
        console.error('Failed to fetch apartment list:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApartments();
  }, [lang]);

  // Get unique values for filters
  const uniquePlaces = [...new Set(apartmentList.map(apt => apt.place))].filter(Boolean);
  const uniqueBuildings = [...new Set(apartmentList.map(apt => apt.building))].filter(Boolean);
  const uniqueSquareFeet = [...new Set(apartmentList.map(apt => apt.square_feet))].filter(Boolean);

  const filteredApartments = apartmentList.filter((apt) => {
    return (
      (!selectedPlace || apt.place === selectedPlace) &&
      (!selectedBuilding || apt.building === selectedBuilding) &&
      (!selectedSquareFeet || apt.square_feet === selectedSquareFeet)
    );
  });

  return (
    <div className="mt-24 p-6 mx-auto max-w-7xl">
      {/* Filters */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <Dropdown
          label={lang === 'ar' ? 'اختر مكان:' : 'Choose a Place:'}
          value={selectedPlace}
          onChange={setSelectedPlace}
          options={uniquePlaces}
        />
        <Dropdown
          label={lang === 'ar' ? 'اختر مبنى:' : 'Choose a Building:'}
          value={selectedBuilding}
          onChange={setSelectedBuilding}
          options={uniqueBuildings}
        />
        <Dropdown
          label={lang === 'ar' ? 'اختر المساحة:' : 'Choose Square Feet:'}
          value={selectedSquareFeet}
          onChange={setSelectedSquareFeet}
          options={uniqueSquareFeet}
        />
      </div>

      {/* Results */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-center">{lang === 'ar' ? 'جاري التحميل...' : 'Loading apartments...'}</p>
        ) : filteredApartments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApartments.map((item) => (
              <div
                key={item.id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700"
              >
                <Link to={`/${lang}/${item.slug}`}>
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={item.image ? `${API_URL}${item.image}` : image}
                    alt={`${item.place} apartment`}
                    onError={(e) => {
                      e.target.src = image;
                    }}
                  />
                </Link>
                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {item.title|| 'No Title'}
                  </h5>
                  <p className="mb-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                    {item.place}
                  </p>
                  {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                    {item.description}
                  </p> */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>{lang === 'ar' ? 'المساحة:' : 'Size:'}</strong> {item.square_feet} {lang === 'ar' ? 'قدم مربع' : 'sq ft'}
                  </p>
                  <Link
                    to={`/${lang}/${item.slug}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {lang === 'ar' ? 'عرض المزيد' : 'View More'}
                    <svg
                      className={`w-3.5 h-3.5 ms-2 ${lang === 'ar' ? 'transform rotate-180' : ''}`}
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
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">
            {lang === 'ar' ? 'لا توجد شقق تطابق عوامل التصفية الخاصة بك' : 'No apartment matches your filters.'}
          </p>
        )}
      </div>
    </div>
  );
};

const Dropdown = ({ label, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 w-full"
    >
      <option value="">-- {label.includes('اختر') ? 'الكل' : 'All'} --</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default List;