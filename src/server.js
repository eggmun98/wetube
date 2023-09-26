import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;
// console.log( process.cwd() )  현재 작업 위치의 디렉토리
// 현재 작업 디렉토리는 노드를 시작하는 디렉토리이다.

const app = express();
const logger = morgan("dev"); // 모간은 미들웨어이다.
app.use(logger); // app.use부터 코드를 적어야 한다. 만약 app.use가 19번줄이고 app.get("/". home)가 18번줄이면 미들웨어는 20번 코드에서만 작동

app.set("view engine", "pug"); // 뷰 엔진을 pug로 쓴다고 등록
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () => console.log("시작sssssss");

app.listen(PORT, handleListening);
