const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");

exports.register = catchAsync(async (req, res) => {
  const data = await authService.registerUser(req.body);
  res.status(201).send({ status: "success", data });
});

exports.login = catchAsync(async (req, res) => {
  const { session, config } = await authService.loginUser(req, res);

  res
    .status(200)
    .cookie(process.env.SESSION_COOKIE_NAME, session, config)
    .send({ status: "success", data: "" });
});

exports.checkAuth = catchAsync(async (req, res) => {
  const data = await authService.checkUserSession(
    req.cookies[process.env.SESSION_COOKIE_NAME]
  );
  return res.status(200).send({ status: "success", data });
});

exports.logout = (req, res) => {
  res
    .status(200)
    .clearCookie(process.env.SESSION_COOKIE_NAME)
    .send({ status: "success", data: "" });
};
