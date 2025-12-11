export function requireAuth(req, res, next) {
  //
  // get hold of active current user from session
  const userId = req.session.userId;

  // !  if session does not exists,no userId exists in active session or vice-versa
  if (!userId) {
    console.error("access has been blocked");
    return res.status(401).json({ error: "unauthorized" });
  }

  //* if userId exists in current active session --> invoke the next mw functionality
  next();
}
