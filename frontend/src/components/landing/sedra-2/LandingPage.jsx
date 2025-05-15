import React from 'react';
import Sedra2Header from './Header'; 
import Sedra2Footer from './Footer'; 

const Sedra2Page = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <Sedra2Header /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Sedra-2</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <Sedra2Footer />
        </>
    );
};

export default Sedra2Page;