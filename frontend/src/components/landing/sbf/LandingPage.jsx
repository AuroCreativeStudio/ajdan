import React from 'react';
import SbfHeader from './Header'; 
import SbfFooter from './Footer'; 

const SbfPage = () => {

    return (
        <>
            <SbfHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to SBF</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <SbfFooter />
        </>
    );
};

export default SbfPage;