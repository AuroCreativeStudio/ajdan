import React from 'react';
import DarahAlfursanHeader from './Header'; 
import DarahAlfursanFooter from './Footer'; 

const DarahAlfursan = () => {
    console.log("Ajdan2Page rendered"); 
    return (
        <>
            <DarahAlfursanHeader /> 
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <section style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                    <h1>Welcome to Darah Alfursan</h1>
                    <p>Your journey to excellence starts here!</p>
                </section>
            </div>
            <DarahAlfursanFooter />
        </>
    );
};

export default DarahAlfursan;