import express from "express";

const PORT = 4000;

const app = express();

const handleHome = () => console.log("get 메소드 잘 작동");

app.get("/", handleHome);

const handleListening = () => console.log("시작sssssss");

app.listen(PORT, handleListening);
