import React from 'react';

function Education() {
    return (
    <div className='container'>
            <div className='row'>
                <div className = 'col-6'>
                    <img src='media/education.svg' style={{width:'70%'}}/>
                </div>
                <div className = 'col-6'>
                    <h1 className='mt-5 fs-3'>Free and open market education</h1>
                    <p className='mt-4'>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>

                    <a href='' className='mr-5' style={{textDecoration:'none'}}>Varsity<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

                    <p className='mt-4'>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>

                    <a href='' className='mr-5' style={{textDecoration:'none'}}>TradingQ&A<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

                </div>
            </div>

        </div>
     );
}


export default Education;