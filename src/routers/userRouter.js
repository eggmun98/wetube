import express from "express";
import {
  edit,
  logout,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadFiles,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit); // all 함수를 쓰면 미들웨어를 get이나 post에 둘다 사용가능
// input의 avatar 이름을 찾아서 single 함수에 넣어줄거임 single은 하나만
// 그리고 저 uploadFiles함수가 실행되면서 req.file에 파일 정보가 담기고 저장한 주소에 파일이 등록됨
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
// userRouter.get("/:id", see);

export default userRouter;
