import express from "express";
import { deleteVideo, edit, see, upload } from "./controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload); // /upload를 /:id보다 위에서 적은 이유는
// /upload를 /:id보다 아래에 적는다면 express의 req가 "/:id" 이 위치가 아이디 자리인줄 알고
// /upload를 보면 거기도 id 자리인줄 알기 때문이다.
// 그래서 /upload를 제일 위에 적고 아래는 파라미터URL을 적는다.
videoRouter.get("/:id", see);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
