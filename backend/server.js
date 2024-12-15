import express from "express";
import cors from "cors";

// app config
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
