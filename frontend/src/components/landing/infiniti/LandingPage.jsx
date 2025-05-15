import React, { useEffect, useState } from 'react';
import InfinitiHeader from './Header';
import InfinitiFooter from './Footer';
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';

const Infiniti = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getListingByIdentifier('infiniti');
      setData(result);
    };

    loadData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <InfinitiHeader />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h1>{data.title}</h1>
          <p><strong>Place:</strong> {data.place}</p>
          <p><strong>Building:</strong> {data.building}</p>
          <p><strong>Size:</strong> {data.square_feet} sq ft</p>
          <p>{data.description}</p>
        </section>
      </div>
      <InfinitiFooter />
    </>
  );
};

export default Infiniti;
