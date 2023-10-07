import User from "../models/User";
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { email, name, password, password2, username, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password  confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error_message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

// 일반 로그인
export const postLogin = async (req, res) => {
  const { username, password } = req.body; // 유저가 입력한 값을 가져옴
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false }); // 여기서 소셜온리를 페일한 이유는 github로 로그인 했는지 안했는지 구분을 위해 작성
  // db에서 유저가 입력한 username에 맞는 username의 유저 데이터를 가져옴

  //   const exists = await User.exists({ username });
  if (!user) {
    // 만약 유저가 잘못된 유저네임을 입력했다면 id가 틀렸다는 뜻이므로 잘못된 유저네임이라고 출력
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username docs not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password); // password를 해쉬화 해서 db에 있는 패스워드랑 비교
  if (!ok) {
    // ok가 없다는 건 비밀번호가 틀렸다는 뜻이므로 로그인 하라고 출력
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true; // 로그인에 성공했으니 세션에 로그인 했다고 등록
  req.session.user = user;
  console.log(req.session);
  return res.redirect("/");
};

// 인증코드를 받기 위해 작성
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  }; // github oauth 설정 url이 길어지니 두개로 baseUrl와 config로 나눔
  const params = new URLSearchParams(config).toString(); // URL 쿼리 문자열로 변환을 위해 작성
  const finalUrl = `${baseUrl}?${params}`; // 두개 합쳐서 리다이렉트하기 위해 작성
  return res.redirect(finalUrl); // 리다이렉트로 유저가 허용하면 인증코드 발급
};

// 인증코드 발급 후 이 코드 실행
// 토큰을 발급 받기 위해 작성(인증코드가 필요함)
export const finishGithubLogin = async (req, res) => {
  const baseUrl = `https://github.com/login/oauth/access_token`;
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json", // api 요청할 때 보내는 방식도 적어줘야 작동함
      },
    })
  ).json();

  // tokenRequest에서 액세스 토큰이 있는지 확인 후 있으면 유저 데이터를 가져옴(단 여기서는 유저 이메일은 못가져옴)
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    // 이메일을 따로 얻기 위해서는 이 api 사용해야 함
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    // 로그인한 유저의 이메일 정보만 emailObj에 담음
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    // emailObj가 없으면 로그인을 안했다는거니 로그인페이지로 리다이렉트함
    if (!emailObj) {
      return res.redirect("/login");
    }

    // github 로그인
    let user = await User.findOne({ email: emailObj.email }); // db에  git이메일로 만들어진 계정이 있는지 확인
    if (!user) {
      // user가 없다면 github로 만들어진 계정이 없다는 뜻이므로 db에 유저 계정을 추가 즉 회원가입
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true; // 세션에 유저가 로그인 했다고 저장
    req.session.user = user;
    return res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy(); // 세션 데이터를 삭제 즉 로그아웃
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", {
    pageTitle: "Edit Profile",
  });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req; // 구조분해할당의 방법중 하나

  console.log("Qq", file);

  // 세션과 유저프로필을 업데이트 하는 방법 중 하나
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  ); // true를 해준 이유는 findByIdAndUpdate는 옛날 데이터를 가져옴 그래서 new를 이용해서 새로운 데이터를 업데이트하게함
  req.session.user = updatedUser;

  // 세션 을 업데이트 하는 방법 중 하나 => 프로필 수정창 인풋의 벨류값에 기본적으로 세션 유저 정보를 넣었음 그래서 세션을 수정해야 함
  // req.session.user = {
  //   ...req.session.user,
  //   name,
  //   email,
  //   username,
  //   location,
  // };

  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },

    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }

  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save(); // 새로운 비밀번호 작동을 위해
  req.session.user.password = user.password; // 세션도 업데이트를 해야 로그아웃 가능 근데 나는 없어도 잘 작동함

  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  const videos = await Video.find({ owner: user._id });
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
    videos,
  });
};
