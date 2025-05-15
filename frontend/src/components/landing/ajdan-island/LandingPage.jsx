import React from 'react';
import AjdanIslandHeader from './Header'; 
import AjdanIslandFooter from './Footer'; 

const AjdanIsland = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <AjdanIslandHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Ajdan Island</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <AjdanIslandFooter />
        </>
    );
};

export default AjdanIsland;