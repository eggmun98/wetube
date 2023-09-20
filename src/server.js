import express from "express";

const PORT = 4000;

const app = express();

// req와 res는 express한테 받는다 req와 res는 오브젝트인다
// 즉 req:{...}, res:{...}  이런 형태로 req와 res를 넣어줄꺼다
const handleHome = (req, res) => {
  return res.send("<h1>hello</h1>");
};

// 브라우저가 요청을 하면 서버는 무조건 응답을 해줘야 한다.
// html파일, 객체, 배열 등등 많은 것을 응답해 줄수 있다.
const handleLogin = (req, res) => {
  return res.end();
};

app.get("/", handleHome);

app.get("/login", handleLogin);

const handleListening = () => console.log("시작sssssss");

app.listen(PORT, handleListening);
