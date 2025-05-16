import React, { useEffect, useState } from 'react';
import Sedra2Header from './Header'; 
import Sedra2Footer from './Footer'; 
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';
import ContactForm from '../PopupContactForm';

const Sedra2Page = () => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const result = await getListingByIdentifier('sedra-2');
      setData(result);
    };

    loadData();
  }, []);

  if (!data) return <p>Loading...</p>;
    return (
        <>
            <Sedra2Header /> 

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
            <Sedra2Footer />
             <ContactForm show={showForm} onClose={() => setShowForm(false)} listingTitle={data.title} />
        </>
    );
};

export default Sedra2Page;