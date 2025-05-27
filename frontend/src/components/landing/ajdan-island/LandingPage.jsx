import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AjdanIslandHeader from './Header';
import AjdanIslandFooter from './Footer';
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';
import ContactForm from '../PopupContactForm';

const AjdanIsland = () => {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Pass current language to the API call
                const result = await getListingByIdentifier('ajdan-island', i18n.language);
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
            <AjdanIslandHeader />
                
            <div style={{ 
                textAlign: isArabic ? 'right' : 'left', 
                direction: isArabic ? 'rtl' : 'ltr',
                padding: '50px',
                fontFamily: isArabic ? "'Noto Sans Arabic', sans-serif" : 'inherit'
            }}>
                <section style={{ 
                    backgroundColor: '#f4f4f4', 
                    padding: '20px', 
                    borderRadius: '8px',
                    textAlign: isArabic ? 'right' : 'left'
                }}>
                    <h1>{getLocalized('title')}</h1>
                    
                    {/* Improved field display with consistent RTL/LTR handling */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', direction: isArabic ? 'rtl' : 'ltr' }}>
                            <strong>{t('place')}:&nbsp;</strong>
                            <span>{getLocalized('place')}</span>
                        </div>
                        
                        <div style={{ display: 'flex', direction: isArabic ? 'rtl' : 'ltr' }}>
                            <strong>{t('building')}:&nbsp;</strong>
                            <span>{getLocalized('building')}</span>
                        </div>
                        
                        <div style={{ display: 'flex', direction: isArabic ? 'rtl' : 'ltr' }}>
                            <strong>{t('size')}:&nbsp;</strong>
                            <span>
                                {data.square_feet} {t('sqft')}
                            </span>
                        </div>
                    </div>
                    
                    <p style={{ 
                        marginTop: '16px',
                        textAlign: isArabic ? 'right' : 'left',
                        direction: isArabic ? 'rtl' : 'ltr'
                    }}>
                        {getLocalized('description')}
                    </p>
                    
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ 
                            borderRadius: '70px', 
                            padding: '10px 24px', 
                            border: 'none', 
                            background: '#007bff', 
                            color: '#fff', 
                            cursor: 'pointer',
                            fontFamily: isArabic ? "'Noto Sans Arabic', sans-serif" : 'inherit',
                            marginTop: '20px'
                        }}
                    >
                        {t('enquire')}
                    </button>
                </section>
            </div>
            
            <AjdanIslandFooter />
            <ContactForm 
                show={showForm} 
                onClose={() => setShowForm(false)} 
                listingTitle={getLocalized('title')}
                isArabic={isArabic}
            />
        </>
    );
};

export default AjdanIsland;