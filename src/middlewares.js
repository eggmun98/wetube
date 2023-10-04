export const localsMiddleware = (req, res, next) => {
  //   console.log(req.session);
  // res.locals는 브라우저와 서버가 공유가 가능하다 즉 전역변수로 만들 수 있다.
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  console.log(res.locals);

  next();
};
