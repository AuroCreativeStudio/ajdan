import React from 'react';
import Sedra1Header from './Header'; 
import Sedra1Footer from './Footer'; 

const Sedra1Page = () => {

    return (
        <>
            <Sedra1Header /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Sedra-1</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <Sedra1Footer />
        </>
    );
};

export default Sedra1Page;