import React, { useState, useEffect } from 'react';
import Ajdan2Header from './Header'; 
import Ajdan2Footer from './Footer'; 
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';
import ContactForm from '../PopupContactForm';

const Ajdan2Page = () => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const result = await getListingByIdentifier('ajdanII');
      setData(result);
    };

    
    loadData();
  }, []);

  if (!data) return <p>Loading...</p>;
    return (
        <>
            <Ajdan2Header /> 
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h1>{data.title}</h1>
          <p><strong>Place:</strong> {data.place}</p>
          <p><strong>Building:</strong> {data.building}</p>
          <p><strong>Size:</strong> {data.square_feet} sq ft</p>
          <p>{data.description}</p>
<button
            onClick={() => setShowForm(true)}
            style={{ borderRadius: '70px', padding: '10px 24px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}
          >
            Enquire Now
          </button>

        </section>
      </div>
            <Ajdan2Footer />
            <ContactForm show={showForm} onClose={() => setShowForm(false)} listingTitle={data.title} />
        </>
    );
};

export default Ajdan2Page;