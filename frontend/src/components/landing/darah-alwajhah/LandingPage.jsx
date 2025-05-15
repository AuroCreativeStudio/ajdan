import React from 'react';
import DarahAlwajhahHeader from './Header'; 
import DarahAlwajhahFooter from './Footer'; 

const DarahAlwajhah = () => {

    return (
        <>
            <DarahAlwajhahHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Darah Alwajhah</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <DarahAlwajhahFooter />
        </>
    );
};

export default DarahAlwajhah;