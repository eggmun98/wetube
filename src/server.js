import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const loggerMiddleware = morgan("dev"); // 모간은 미들웨어이다.

const home = (req, res) => {
  console.log("I will respond.");
  return res.send("heelog");
};

const login = (req, res) => {
  return res.send("login");
};

app.use(loggerMiddleware); // app.use부터 코드를 적어야 한다. 만약 app.use가 19번줄이고 app.get("/". home)가 18번줄이면 미들웨어는 20번 코드에서만 작동
app.get("/", home);
app.get("/login", login);

const handleListening = () => console.log("시작sssssss");

app.listen(PORT, handleListening);
