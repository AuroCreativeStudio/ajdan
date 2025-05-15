import React from 'react';
import BayfrontHeader from './Header'; // Ensure this path is correct
import BayfrontFooter from './Footer'; // Updated path for Footer

const AjdanBayfront = () => {
    console.log("Ajdan2Page rendered"); // Debugging log
    return (
        <>
            <BayfrontHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Bayfront</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <BayfrontFooter />
        </>
    );
};

export default AjdanBayfront;