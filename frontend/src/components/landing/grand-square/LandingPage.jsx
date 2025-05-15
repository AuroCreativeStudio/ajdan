import React from 'react';
import GrandSquareHeader from './Header'; // Ensure this path is correct
import GrandSquareFooter from './Footer'; // Updated path for Footer

const GrandSquare = () => {
    console.log("Ajdan2Page rendered"); // Debugging log
    return (
        <>
            <GrandSquareHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to GrandSquare</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <GrandSquareFooter />
        </>
    );
};

export default GrandSquare;