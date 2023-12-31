import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";

// console.log( process.cwd() )  현재 작업 위치의 디렉토리
// 현재 작업 디렉토리는 노드를 시작하는 디렉토리이다.

const app = express();
const logger = morgan("dev"); // 모간은 미들웨어이다.

app.set("view engine", "pug"); // 뷰 엔진을 pug로 쓴다고 등록
app.set("views", process.cwd() + "/src/views"); // 뷰 엔진의 디렉토리 위치 변경
app.use(logger); // app.use부터 코드를 적어야 한다. 만약 app.use가 19번줄이고 app.get("/". home)가 18번줄이면 미들웨어는 20번 코드에서만 작동
app.use(express.urlencoded({ extended: true })); // express가 form data를 읽을 수 있게 해줌 즉 자바스크립트 오브젝트 형식으로 바꿔줌

// 세션이라는 미들웨어는 브라우저 쿠키에 전송하는 역활
// 즉 우리가 백엔드 API 응답을 받을때마다 쿠키도 같이 보냄
// 브라우저와 백엔드는 항상 연결되어 있지는 않다 요청과 응답이 끝나면 연결이 끊김
// 즉 로그인 유지할떄 무제가 생김 그래서 서버가 유저에게 세션ID를 주고 그 세션ID를 쿠키에 저장
// 쿠키에 있는 세션ID를 이용하여 서버와 브라우저끼리 정보교환을 한다.
// 관리자 도구 - 애플리케이션 - 쿠키 - 세션ID에 저장
// 쿠키는 단지 정보를 주고 받는 방법이다.
// 세션ID는 백엔드에도 저장이 되고 브라우저에도(쿠키) 저장
// 백엔드에는 생성된 세션ID들을 관리
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // 이건 세션을 수정할때만 세션을 저장할 수 있도록 설정 그니까 유저컨트롤러에서 postLogin을 할때마다
    // 세션을 수정하고 있으니 저장되겠지?
    // cookie: {
    //   maxAge: 20000,
    // }, // 쿠키 만료기간 정할 수 있음
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL, // 이 부분이 세션 정보들을 db에 저장 즉 이제 서버에 저장되지 않고 db에 저장되므로
      // 자동으로 로그인이 유지가 됨
    }),
  })
);

// 현재 로그인한 유저를 볼수 있음
// app.use((req, res, next) => {
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); // express가 파일 위치를 읽으려면 필요함
app.use("/static", express.static("assets")); // assets 폴더를 static라는 이름으로 불러오게함
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
