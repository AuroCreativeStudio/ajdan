import React from 'react';
import KhobarPeirsHeader from './Header'; 
import KhobarPeirsFooter from './Footer'; 

const KhobarPeirs = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <KhobarPeirsHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Khobar Peirs</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <KhobarPeirsFooter />
        </>
    );
};

export default KhobarPeirs;