export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = (req, res) => {
  console.log(req.body);
};

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("delete user");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See");
