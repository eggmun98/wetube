import express from "express";

const PORT = 4000;

const app = express();

const handleListening = () => console.log("시작sssssss");

app.listen(PORT, handleListening);
