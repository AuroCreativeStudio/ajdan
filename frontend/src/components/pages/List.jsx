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
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedPaymentPlans, setSelectedPaymentPlans] = useState([]);

  const location = useLocation();
  const match = location.pathname.match(/^\/(en|ar)(\/|$)/);
  const lang = match ? match[1] : 'en';

  // Default values for English fields
  const defaultAmenitiesEn = ['Swimming Pool', 'Gym', 'Sea View', 'Smart Home'];
  const defaultPropertyTypesEn = ['Residential', 'Commercial', 'Mixed-Use'];
  const defaultPaymentPlansEn = ['Financing', 'Down Payment'];

  // Default values for Arabic fields
  const defaultAmenitiesAr = ['إطلالة على البحر', 'المنزل الذكي', 'نادي رياضي','حمام السباحة'];
  const defaultPropertyTypesAr = ['سكني','تجاري','متعدد الاستخدامات'];
  const defaultPaymentPlansAr = ['التمويل', 'دفعة مبدئية'];

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await fetchApartmentList(lang);
        // Process the data to ensure default values are set
        const processedData = data.map(project => ({
          ...project,
          amenities_en: project.amenities_en || defaultAmenitiesEn,
          property_type_en: project.property_type_en || defaultPropertyTypesEn,
          payment_plan_en: project.payment_plan_en || defaultPaymentPlansEn,
          amenities_ar: project.amenities_ar || defaultAmenitiesAr,
          property_type_ar: project.property_type_ar || defaultPropertyTypesAr,
          payment_plan_ar: project.payment_plan_ar || defaultPaymentPlansAr
        }));
        setApartmentList(processedData);
        console.log('Fetched apartments:', processedData);
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
  
  // Get unique values for multi-select filters
  const allAmenities = apartmentList.flatMap(apt => lang === 'ar' ? apt.amenities_ar || [] : apt.amenities_en || []);
  const uniqueAmenities = [...new Set(allAmenities)].filter(Boolean);
  
  const allPropertyTypes = apartmentList.flatMap(apt => lang === 'ar' ? apt.property_type_ar || [] : apt.property_type_en || []);
  const uniquePropertyTypes = [...new Set(allPropertyTypes)].filter(Boolean);
  
  const allPaymentPlans = apartmentList.flatMap(apt => lang === 'ar' ? apt.payment_plan_ar || [] : apt.payment_plan_en || []);
  const uniquePaymentPlans = [...new Set(allPaymentPlans)].filter(Boolean);

  const filteredApartments = apartmentList.filter((apt) => {
    const matchesPlace = !selectedPlace || apt.place === selectedPlace;
    const matchesBuilding = !selectedBuilding || apt.building === selectedBuilding;
    const matchesSquareFeet = !selectedSquareFeet || apt.square_feet === selectedSquareFeet;
    
    // Check if apartment has all selected amenities
    const amenities = lang === 'ar' ? apt.amenities_ar : apt.amenities_en;
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => amenities?.includes(amenity));
    
    // Check if apartment has all selected property types
    const propertyTypes = lang === 'ar' ? apt.property_type_ar : apt.property_type_en;
    const matchesPropertyTypes = selectedPropertyTypes.length === 0 || 
      selectedPropertyTypes.every(type => propertyTypes?.includes(type));
    
    // Check if apartment has all selected payment plans
    const paymentPlans = lang === 'ar' ? apt.payment_plan_ar : apt.payment_plan_en;
    const matchesPaymentPlans = selectedPaymentPlans.length === 0 || 
      selectedPaymentPlans.every(plan => paymentPlans?.includes(plan));
    
    return (
      matchesPlace &&
      matchesBuilding &&
      matchesSquareFeet &&
      matchesAmenities &&
      matchesPropertyTypes &&
      matchesPaymentPlans
    );
  });

  const toggleSelection = (value, selectedValues, setSelectedValues) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(item => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  return (
    <div className="mt-24 p-6 mx-auto max-w-7xl">
      {/* Filters */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <Dropdown
          label={lang === 'ar' ? 'اختر مكان:' : 'Choose a Place:'}
          value={selectedPlace}
          onChange={setSelectedPlace}
          options={uniquePlaces}
          lang={lang}
        />
        <Dropdown
          label={lang === 'ar' ? 'اختر مبنى:' : 'Choose a Building:'}
          value={selectedBuilding}
          onChange={setSelectedBuilding}
          options={uniqueBuildings}
          lang={lang}
        />
        <Dropdown
          label={lang === 'ar' ? 'اختر المساحة:' : 'Choose Square Feet:'}
          value={selectedSquareFeet}
          onChange={setSelectedSquareFeet}
          options={uniqueSquareFeet}
          lang={lang}
        />
        
        {/* Multi-select Amenities Filter */}
        <MultiSelectDropdown
          label={lang === 'ar' ? 'المرافق:' : 'Amenities:'}
          selectedValues={selectedAmenities}
          options={uniqueAmenities}
          onChange={(value) => toggleSelection(value, selectedAmenities, setSelectedAmenities)}
          lang={lang}
        />
        
        {/* Multi-select Property Types Filter */}
        <MultiSelectDropdown
          label={lang === 'ar' ? 'نوع العقار:' : 'Property Type:'}
          selectedValues={selectedPropertyTypes}
          options={uniquePropertyTypes}
          onChange={(value) => toggleSelection(value, selectedPropertyTypes, setSelectedPropertyTypes)}
          lang={lang}
        />
        
        {/* Multi-select Payment Plans Filter */}
        <MultiSelectDropdown
          label={lang === 'ar' ? 'خطط الدفع:' : 'Payment Plans:'}
          selectedValues={selectedPaymentPlans}
          options={uniquePaymentPlans}
          onChange={(value) => toggleSelection(value, selectedPaymentPlans, setSelectedPaymentPlans)}
          lang={lang}
        />
        
        {/* Clear all filters button */}
        <button
          onClick={() => {
            setSelectedPlace('');
            setSelectedBuilding('');
            setSelectedSquareFeet('');
            setSelectedAmenities([]);
            setSelectedPropertyTypes([]);
            setSelectedPaymentPlans([]);
          }}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
        >
          {lang === 'ar' ? 'مسح جميع الفلاتر' : 'Clear all filters'}
        </button>
      </div>

      {/* Results */}
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
        {/* Title */}
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {item.title || 'No Title'}
        </h5>

        {/* Place and Building */}
        <div className="mb-2">
          <p className="text-lg font-normal text-gray-700 dark:text-gray-400">
            {item.place}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {item.building}
          </p>
        </div>

        {/* Square Feet */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          <strong>{lang === 'ar' ? 'المساحة:' : 'Size:'}</strong> {item.square_feet} {lang === 'ar' ? 'قدم مربع' : 'sq ft'}
        </p>

        {/* Description */}
        {item.description && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            {item.description}
          </p>
        )}

        {/* Amenities */}
        <div className="mb-2">
          <span className="text-sm font-semibold">
            {lang === 'ar' ? 'المرافق:' : 'Amenities:'}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {(lang === 'ar' ? item.amenities_ar : item.amenities_en)?.map((amenity, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div className="mb-2">
          <span className="text-sm font-semibold">
            {lang === 'ar' ? 'نوع العقار:' : 'Property Type:'}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {(lang === 'ar' ? item.property_type_ar : item.property_type_en)?.map((type, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Payment Plans */}
        <div className="mb-4">
          <span className="text-sm font-semibold">
            {lang === 'ar' ? 'خطط الدفع:' : 'Payment Plans:'}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {(lang === 'ar' ? item.payment_plan_ar : item.payment_plan_en)?.map((plan, idx) => (
              <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {plan}
              </span>
            ))}
          </div>
        </div>

        {/* View More Button */}
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
    </div>
  );
};

const Dropdown = ({ label, value, onChange, options, lang }) => (
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

const MultiSelectDropdown = ({ label, selectedValues, options, onChange, lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block mb-1 font-medium">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded p-2 text-left flex justify-between items-center ${lang === 'ar' ? 'text-right' : ''}`}
      >
        <span>
          {selectedValues.length > 0 
            ? selectedValues.join(', ') 
            : lang === 'ar' ? 'الكل' : 'All'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className={`absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto ${lang === 'ar' ? 'text-right' : ''}`}>
          <div className="p-2 space-y-1">
            {options.map((option) => (
              <div 
                key={option} 
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onChange(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  readOnly
                  className={lang === 'ar' ? 'ml-2' : 'mr-2'}
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;