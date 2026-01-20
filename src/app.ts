import express from "express";
import searchRoute from "./routes/search"

const app = express();

app.use(express.json());
app.use("/naver", searchRoute)

export default app;