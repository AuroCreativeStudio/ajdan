import React from 'react';
import WaterfrontHeader from './Header'; 
import WaterfrontFooter from './Footer'; 

const Waterfront = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <WaterfrontHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Waterfront</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <WaterfrontFooter />
        </>
    );
};

export default Waterfront;