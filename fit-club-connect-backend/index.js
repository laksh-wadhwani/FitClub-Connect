const express =  require("express");
const cors = require('cors');
const mongoose =  require("mongoose");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.static('uploads'))

const dotenv = require('dotenv')
dotenv.config();

mongoose.connect(process.env.DB_URI,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    app.listen(9002, () => {
        console.log("Server is connected and Connected to MongoDB");
    })
}).catch(error => {
    console.log("Unable to connect Server and/or MongoDB", error);
});


// GYM Routes
const ClubRouter = require("./routes/ClubRoutes")
app.use("/Club", ClubRouter)


//Package Routes
const PackageRouter = require("./routes/PackageRoutes")
app.use("/Package", PackageRouter)

//User Routes
const EnthusiastRouter = require("./routes/EnthusiastsRoutes")
app.use("/Enthusiast", EnthusiastRouter)

//Cart Routes
const CartRouter = require("./routes/CartRoutes")
app.use("/Cart", CartRouter)

//Admin Routes
const AdminRouter = require("./routes/AdminRoutes")
app.use("/Admin", AdminRouter)

//Newsletter Route
const NewsLetter = require("./routes/NewsLetterRoutes");
app.use("/", NewsLetter)