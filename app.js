const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const grocerieRouter = require("./routes/grocerieRoutes");
const listRouter = require("./routes/listRoutes");
const app = express();
const port = 3000;
const URI = process.env.DB_URI;

mongoose
  .connect(URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`mongooseConnect ERROR: ${err}`);
  });

app.set("view engine", "ejs");
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", grocerieRouter);
app.use("/list", listRouter);
