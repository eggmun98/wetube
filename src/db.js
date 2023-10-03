import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: true,  최신 버전의 몽고db에서는 필요없음
}); // 몽고db 연결시켜줌

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB Check");
const handleError = () => (error) => console.log("DB Error", error);
db.on("error", handleError); // on은 여러번 일어남
db.once("open", handleOpen); // once은 한번만 실행
