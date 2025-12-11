import { getDBConnection } from "../db/db.js";

export async function getCurrentUser(req, res) {
  const db = await getDBConnection();

  //! checking if  last user entry added to db

  // --> fetching its userId ( storing the id from table users)
  const Last_userId = req.session.userId;
  try {
    if (!req.session.userId) {
      return res.json({ isLoggedIn: false });
    }

    // if userId of last client entry from session exists --> fetch that user's name
    const fetchUserFromSession = await db.get(
      `
        select name from users
            where id = ?
        `,
      [Last_userId]
    );
    res.json({ isLoggedIn: true, name: fetchUserFromSession.name });
  } catch (err) {
    console.error("getCurrentUser error :", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
