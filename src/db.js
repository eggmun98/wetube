import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // 몽고db 연결시켜줌

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB Check");
const handleError = () => (error) => console.log("DB Error", error);
db.on("error", handleError); // on은 여러번 일어남
db.once("open", handleOpen); // once은 한번만 실행
