import "./db"; // 파일 자체를 import => db와 연결
import "./models/Video";
import "./models/User";

import app from "./server";

const PORT = 4000;

const handleListening = () => console.log("시작sssssss");

app.listen(PORT, handleListening);
