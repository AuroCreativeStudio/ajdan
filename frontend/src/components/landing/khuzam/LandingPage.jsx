import React from 'react';
import KhuzamHeader from './Header'; // Ensure this path is correct
import KhuzamFooter from './Footer'; // Updated path for Footer

const Khuzam = () => {
    console.log("Ajdan2Page rendered"); // Debugging log
    return (
        <>
            <KhuzamHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Khuzam</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <KhuzamFooter />
        </>
    );
};

export default Khuzam;