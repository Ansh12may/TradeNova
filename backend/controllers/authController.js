const {registerUser,loginUser} = require("../services/authService.js");

const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        const user = await registerUser({
            name,
            email,
            password
        });
        res.status(201).json({
        message: "User registered successfully",
        user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })

        
    } catch (error) {
        if (error.message === "User already exists") {
        return res.status(400).json({
        message: error.message,
      });
    }
    console.error("Registration error:", error);

    res.status(500).json({
    message: "Internal server error",
    });
        
    }
}



const login = async(req,res)=>{
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser({email,password});
        res.status(200).json({
        message: "Login successful",
        token,  
        user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });   
    } catch (error) {
        if (error.message === "Invalid credentials") {
        return res.status(401).json({
        message: "Invalid credentials",
      });

    }
    console.error("Login error:", error);
    res.status(500).json({
    message: "Internal server error",
    });

  }

};
        
    


module.exports= {
    register,login,
}