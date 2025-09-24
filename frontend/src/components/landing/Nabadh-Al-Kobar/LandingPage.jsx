import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sedra2Header from './Header'; 
import Sedra2Footer from './Footer'; 
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';
import ContactForm from '../PopupContactForm';

const Sedra2Page = () => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getListingByIdentifier('sedra-2', i18n.language);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [i18n.language]);

  const isArabic = i18n.language === 'ar';

  if (!data) return <p>{t('loading')}...</p>;

  // Helper function to get localized field
  const getLocalized = (field) => {
    return (isArabic && data[`${field}_ar`]) ? data[`${field}_ar`] : data[field];
  };

  return (
    <>
      <Sedra2Header />
      
      <div style={{ 
        textAlign: isArabic ? 'right' : 'left', 
        direction: isArabic ? 'rtl' : 'ltr',
        padding: '50px',
        fontFamily: isArabic ? "'Noto Sans Arabic', sans-serif" : 'inherit'
      }}>
        <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h1>{getLocalized('title')}</h1>
          <p><strong>{t('place')}:</strong> {getLocalized('place')}</p>
          <p><strong>{t('building')}:</strong> {getLocalized('building')}</p>
       <p style={{ display: 'flex', direction: isArabic ? 'rtl' : 'ltr' }}>
  <strong>{t('size')}:</strong>&nbsp;
  <span>
    {data.square_feet} {t('sqft')}
  </span>
</p>
          <p>{getLocalized('description')}</p>
          <button
            onClick={() => setShowForm(true)}
            style={{ 
              borderRadius: '70px', 
              padding: '10px 24px', 
              border: 'none', 
              background: '#007bff', 
              color: '#fff', 
              cursor: 'pointer',
              fontFamily: isArabic ? "'Noto Sans Arabic', sans-serif" : 'inherit'
            }}
          >
            {t('enquire')}
          </button>
        </section>
      </div>
      
      <Sedra2Footer />
      <ContactForm 
        show={showForm} 
        onClose={() => setShowForm(false)} 
        listingTitle={getLocalized('title')}
        isArabic={isArabic}
      />
    </>
  );
};

export default Sedra2Page;