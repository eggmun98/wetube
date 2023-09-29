import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// save 하기 전에 미들웨어 함수가 발동 이 함수가 발동하는 거지 즉 해쉬태그를 처리하고 저장
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((el) => (el.startsWith("#") ? el : `#${el}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
