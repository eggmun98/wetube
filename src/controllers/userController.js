import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { email, name, password, password2, username, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Password  confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }

  //   const emailExists = await User.exists({ email });
  //   if (emailExists) {
  //     return res.render("join", {
  //       pageTitle,
  //       errorMessage: "This email is already taken",
  //     });
  //   }

  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  res.redirect("/login");
};

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("delete user");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See");
