import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find();
  console.log(videos);
  res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  console.log(video);
  res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing: ` });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title; // 목업 데이터 베이스 수정
  res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  console.log(req.body);
  const { title, description, hashtags } = req.body;

  try {
    const video = new Video({
      title,
      description,
      hashtags: hashtags.split(",").map((el) => `#${el}`),
    });
    const dbVideo = await video.save();
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",

      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};
