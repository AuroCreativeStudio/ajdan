import React from 'react';
import RejanHeader from './Header'; 
import RejanFooter from './Footer'; 

const Rejan = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <RejanHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Rejan</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <RejanFooter />
        </>
    );
};

export default Rejan;