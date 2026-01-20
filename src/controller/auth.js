import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshUserSession,
  logoutAllOtherSessions
} from "../services/auth.js";

const setupCookies = (res, accessToken, refreshToken, sessionId) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  const refreshTokenOpenAge = 7 * 24 * 60 * 60 * 1000;
  const accessTokenOpenAge = 15 * 60 * 1000;

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: refreshTokenOpenAge,
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: accessTokenOpenAge,
  });

  if (sessionId) {
    res.cookie("sessionId", sessionId, {
      ...cookieOptions,
      maxAge: refreshTokenOpenAge,
    });
  }
};

export const registerController = async (req, res) => {
  const session = await registerUser(req.body);

  setupCookies(res, session.accessToken, session.refreshToken, session.sessionId);

  res.status(201).json({
    message: "Successfully registered",
    data: {
      user: session.user,
      accessToken: session.accessToken,
    },
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  setupCookies(res, session.accessToken, session.refreshToken, session.sessionId);

  res.status(200).json({
    message: "Successfully logged in",
    data: {
      user: session.user,
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("sessionId"); 

  res.status(204).send();
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  const session = await refreshUserSession(refreshToken);

  setupCookies(res, session.accessToken, session.refreshToken, session.sessionId);

  res.status(200).json({
    message: "Session refreshed",
    data: {
      accessToken: session.accessToken,
    },
  });
};

// diğer oturumları kapatma controller
export const logoutOtherSessionsController = async (req, res) => {
  const { id: userId } = req.user;
  
  const { sessionId } = req.cookies;

  if (!sessionId) {
    res.status(400).json({ message: "Session ID missing" });
    return;
  }

  await logoutAllOtherSessions(userId, sessionId);

  res.status(200).json({
    message: "Logged out from all other devices",
  });
};