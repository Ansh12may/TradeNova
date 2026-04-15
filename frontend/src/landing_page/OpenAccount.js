import React from 'react';
import { useNavigate } from "react-router-dom";

function OpenAccount() {
    const navigate = useNavigate();
    return ( 
        <div className="container p-5 mb-5">
            <div className="row text-center">
                    <h1 className='mt-5 fs-3'>Open a Zerodha account</h1>
                    <p className='mt-3'>Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
                    <button 
                    className='p-2 btn btn-primary mt-3'
                    style={{ width: "25%", margin: '0 auto' }}
                    onClick={() => navigate("/signup")}
                    >
                    Sign up for free
                    </button>
            </div>
        </div>
     );
}

export default OpenAccount;