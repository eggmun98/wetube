import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find().sort({ createdAt: "desc" });
  console.log(videos);
  res.render("home", { pageTitle: "Home", videos });
};

// 상태코드 400을 받으면 브라우저는 url을 히스토리에 저장하지 않을거다.
// 근데 200을 주면 url을 히스토리에 저장

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video, owner });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Editing:${video.title} `, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); // 비디오 객체를 다 가져올 필요가 없음 exists가 true false로 Video가 있는지 판단
  // 즉 영상이 있는지 없는지만 확인하는게 효율적 getEdit는 pageTitle에 타이틀을 보내줘야 하기 때문에 객체를 다 가져옴
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  console.log(req.body);
  const { title, description, hashtags } = req.body;

  try {
    const video = new Video({
      title,
      description,
      fileUrl,
      owner: _id, // 유저의 아이디를 저장
      hashtags: Video.formatHashtags(hashtags),
    });
    await video.save();
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",

      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  console.log(id);
  // delete video
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
