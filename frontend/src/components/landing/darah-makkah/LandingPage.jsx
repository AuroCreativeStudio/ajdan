import React from 'react';
import DarahMakkahHeader from './Header'; 
import DarahMakkahFooter from './Footer'; 

const DarahMakkah = () => {
    
    return (
        <>
            <DarahMakkahHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Darah Makkah</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <DarahMakkahFooter />
        </>
    );
};

export default DarahMakkah;