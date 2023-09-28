import express from "express";
import { getEdit, postEdit, watch } from "./controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
// videoRouter.get("/:id(\\d+)/edit", getEdit); 주석 친 코드 두줄을 위 방식으로 하나로 줄일 수 있음
// videoRouter.post("/:id(\\d+)/edit", postEdit);

export default videoRouter;
