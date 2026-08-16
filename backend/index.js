const express = require("express");
require('dotenv').config();
const connectDb = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");
const {HoldingModel} =require("./models/HoldingModel");
const {PositionsModel} = require("./models/PositionsModel");
const {OrdersModel} = require("./models/OrdersModel");
const authMiddleware = require("./middlewares/authMiddleware");
const mlRoutes = require("./routes/mlRoutes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3002;


app.listen(port,()=>{
  console.log(`server started on port ${port}`);
  connectDb();
})

app.use(
  cors({
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);




//Holdings
//     let tempHoldings =  [
//   {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
// ];

// tempHoldings.forEach((item)=>{
//     let newHolding = new HoldingModel({
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.net,
//         day: item.day,
//     });

//     newHolding.save();

// });
// res.send("done");

// })

// app.get("/addPositions",async(req,res)=>{
//     let tempPositions = [
//         {
//             product:"CNC",
//             name:"EVEREADY",
//             qty:2,
//             avg:316.27,
//             price:312.25,
//             net:"+0.58%",
//             day:"-1.24%",
//             isLoss:true,
//         },
//         {
//             product:"CNC",
//             name:"JUBLFOOD",
//             qty:1,
//             avg:3124.27,
//             price:3082.25,
//             net:"+10.04%",
//             day:"-1.35%",
//             isLoss:true,  
//         }
//     ];

//     tempPositions.forEach((item)=>{
//     let newPosition = new PositionsModel({
//         product: item.product,
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.net,
//         day:item.day,
//         isLoss:item.isLoss,
//     });

//     newPosition.save();
// });
// res.send("done");

// })




//Holdings
app.get("/allHoldings", authMiddleware, async (req, res) => {
  try {
    const allHoldings = await HoldingModel.find({
      userId: req.user.id,
    });

    res.json(allHoldings);
  } catch (err) {
    console.error("Error fetching holdings:", err);

    res.status(500).json({
      message: "Failed to fetch holdings",
    });
  }
});


//Positions
app.get("/allPositions", authMiddleware, async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({
      userId: req.user.id,
    });
    res.json(allPositions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({
      message: "Failed to fetch positions",
    });
  }
});


//Orders
app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    // 1. Validate request

    if (!name || qty === undefined || price === undefined || !mode) {
      return res.status(400).json({
        message: "Name, quantity, price and mode are required",
      });
    }
    const quantity = Number(qty);
    const orderPrice = Number(price);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (!Number.isFinite(orderPrice) || orderPrice <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    if (!["BUY", "SELL"].includes(mode)) {
      return res.status(400).json({
        message: "Mode must be BUY or SELL",
      });
    }
    // 2. BUY
    if (mode === "BUY") {
      const existingHolding = await HoldingModel.findOne({
        userId: req.user.id,
        name,
      });

      if (existingHolding) {
        const oldQty = Number(existingHolding.qty);
        const oldAvg = Number(existingHolding.avg);

        const newQty = oldQty + quantity;

        const newAvg =
          (oldQty * oldAvg + quantity * orderPrice) /
          newQty;

        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        existingHolding.price = orderPrice;

        await existingHolding.save();
      } else {
        const newHolding = new HoldingModel({
          userId: req.user.id,
          name,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "0%",
          day: "0%",
        });

        await newHolding.save();
      }
    }
    // 3. SELL
    if (mode === "SELL") {
      const existingHolding = await HoldingModel.findOne({
        userId: req.user.id,
        name,
      });

      // User doesn't own this stock
      if (!existingHolding) {
        return res.status(400).json({
          message: `You do not own any ${name} shares`,
        });
      }

      const currentQty = Number(existingHolding.qty);

      // User is trying to sell more than they own
      if (quantity > currentQty) {
        return res.status(400).json({
          message: `Insufficient holdings. You own ${currentQty} shares of ${name}`,
        });
      }

      const remainingQty = currentQty - quantity;

      // If everything was sold, remove the holding
      if (remainingQty === 0) {
        await HoldingModel.deleteOne({
          _id: existingHolding._id,
        });
      } else {
        existingHolding.qty = remainingQty;
        existingHolding.price = orderPrice;

        await existingHolding.save();
      }
    }
    // 4. Save order
   
    const newOrder = new OrdersModel({
      userId: req.user.id,
      name,
      qty: quantity,
      price: orderPrice,
      mode,
    });

    await newOrder.save();
    // 5. Response
    res.status(201).json({
      message: `${mode} order executed successfully`,
      order: newOrder,
    });

  } catch (err) {
    console.error("Error creating order:", err);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
});



//To get orders
app.get("/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await OrdersModel.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});