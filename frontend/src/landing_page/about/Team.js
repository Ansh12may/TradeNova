import React from 'react';


function Team() {
    return ( 
        <div>
            <div className="container">
      <div className="row p-5 mt-5 mb-5 border-top">
        <h1 className=' text-center mt-5'>
          People
        </h1>

      </div>

      <div className="row p-5 mt-5 text-muted fs-6" style={{lineHeight:"1.8",fontSize:"1.8em"}}>
        <div className='col-6 p-5 text-center'>
          
        <img src='media/Ashu.jpeg' style={{borderRadius:"100%",width:"70%"}}/>
        <h4 className='mt-3'>Ashutosh Kushwaha</h4>
        <h6 className='mb-3'>Full Stack Developer | AI Enthusiast</h6>
        </div>
        <div className='col-6'>
<p className='fs-5'>
I'm Ashutosh Kushwaha, the developer behind this MERN stack application. I designed and implemented both frontend and backend systems using React for UI, Node.js and Express for server-side logic, and MongoDB for data persistence.
</p>

<p className='fs-5'>
The project demonstrates RESTful API design, component-based architecture, and efficient state management to ensure smooth user interaction and performance.
</p>

<p className='fs-5'>
My focus is on building scalable web applications and strengthening my understanding of system design and backend architecture.
</p>
       
        </div>
        

      </div>
    </div>
        </div>
     );
}

export default Team;