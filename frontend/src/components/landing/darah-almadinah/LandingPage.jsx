import React from 'react';
import DarahAlmadinahHeader from './Header'; 
import DarahAlmadinahFooter from './Footer'; 

const DarahAlmadinah = () => {
  
    return (
        <>
            <DarahAlmadinahHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Darah Almadinah</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <DarahAlmadinahFooter />
        </>
    );
};

export default DarahAlmadinah;