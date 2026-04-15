import React from 'react';
import { useNavigate } from "react-router-dom";


function Hero() {
    const navigate = useNavigate();
    return ( 
        <div className="container p-5 mb-5">
            <div className="row text-center">
                    <img src='media/homeHero.png' alt='heroIam' className="mb-5"/>
                    <h1 className='mt-5 fs-3'>Invest in everything</h1>
                    <p className='mt-3'>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
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
export default Hero;