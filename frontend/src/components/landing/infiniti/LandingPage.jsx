import React from 'react';
import InfinitiHeader from './Header'; 
import InfinitiFooter from './Footer'; 

const Infiniti = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <InfinitiHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Infiniti</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <InfinitiFooter />
        </>
    );
};

export default Infiniti;