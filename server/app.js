const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 4000;
const cors = require("cors");
const router = require("./routes/route");
const unzipFiles = require("./utils/unzip")();

app.use(express.json());
app.use(cors());

app.use("/api", router);
app.get("/", (req, res) => res.send("Application is Running"));

app.listen(port, () => {
  console.log(`Application listening on port http://localhost:${port}`);
});
