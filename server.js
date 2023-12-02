const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const { config } = require("./config/settings");
const port = config.port;

// Database connection
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "*"}));
app.use(express.urlencoded({ extended: false }));

// mount points
app.use("/users", require("./routes/userRoutes"));


app.listen(port, () =>
  console.log(`Server running on port: ${port}`.cyan.italic.bold)
);
