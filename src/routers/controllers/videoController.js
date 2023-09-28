export const trending = (req, res) => {
  const videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 2,
    },
    {
      title: "three Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 3,
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => {
  res.render("watch", { pageTitle: "Watch Video" });
};
export const edit = (req, res) => {
  res.render("edit", { pageTitle: "Edit Video" });
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");
