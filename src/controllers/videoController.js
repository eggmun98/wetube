import Video from "../models/Video";

export const home = async (req, res) => {
  // Video.find({}, (err, videos) => {
  // });

  const videos = await Video.find();
  return res.render("home", { pageTitle: "Home", videos }); // 콜백함수의 방법 // db를 불러오기 전에 랜더하기 방지하기 위해 콜백함수 안에 넣음
};

export const watch = (req, res) => {
  const { id } = req.params;
  res.render("watch", { pageTitle: `Watch ` });
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

export const postUpload = (req, res) => {
  console.log(req.body);
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 1,
    id: 1,
  };
  videos.push(newVideo);
  // here we will add a video to the videos array.
  return res.redirect("/");
};
