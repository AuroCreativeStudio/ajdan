import React from 'react';
import Ajdan2Header from './Header'; // Ensure this path is correct
import Ajdan2Footer from './Footer'; // Updated path for Footer

const Ajdan2Page = () => {
    console.log("Ajdan2Page rendered"); // Debugging log
    return (
        <>
            <Ajdan2Header /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Ajdan2</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <Ajdan2Footer />
        </>
    );
};

export default Ajdan2Page;