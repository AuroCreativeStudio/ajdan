import React from 'react';
import BuhiratHeader from './Header'; // Ensure this path is correct
import BuhiratFooter from './Footer'; // Updated path for Footer

const Buhirat = () => {
    console.log("Ajdan2Page rendered"); // Debugging log
    return (
        <>
            <BuhiratHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Buhirat</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <BuhiratFooter />
        </>
    );
};

export default Buhirat;