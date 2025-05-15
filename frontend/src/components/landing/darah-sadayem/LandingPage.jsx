import React from 'react';
import DarahSadayemHeader from './Header'; 
import DarahSadayemFooter from './Footer'; 

const DarahSadayem = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <DarahSadayemHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Darah Sadayem</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <DarahSadayemFooter />
        </>
    );
};

export default DarahSadayem;