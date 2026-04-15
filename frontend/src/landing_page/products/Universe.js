import React from 'react';


function Universe() {
    return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1 className="mt-5 fs-3">The Zerodha Universe</h1>
        <p className="mt-3">
         Extend your trading and investment experience even further with our partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src='media/zerodhaFundhouse.png' style={{width:"200px"}}/>
          <p className='text-small text muted'>
            Our asset management venture
            that is creating simple and transparent index
            unds to help you save for your goals.</p>
        </div>

        <div className="col-4 p-3  mt-5">
          <img src='media/sensibullLogo.svg' style={{width:"200px"}}/>
          <p className='text-small text muted'>
            
Options trading platform that lets you
create strategies, analyze positions, and examine
data points like open interest, FII/DII, and more.</p>
        </div>


        <div className="col-4 p-3 ">
          <img src='media/streakLogo.png' style={{width:"200px"}}/>
          <p className='text-small text muted'>
           
Systematic trading platform
that allows you to create and backtest
strategies without coding.</p>
        </div>
        
      </div>
    </div>
  );
}

export default Universe;