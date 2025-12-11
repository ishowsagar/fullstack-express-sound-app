import validator from "validator";
import bcrypt from "bcryptjs";
import { getDBConnection } from "../db/db.js";
export async function registerUser(req, res) {
  // console.log('req body :',req.body)

  // incoming bodyObj from client

  //   removing unneccesary white-space from fields
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  //   if all fields exists logic
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "all fields are required" });
  }

  //   validate username with regex
  const pattern = /^[a-zA-Z0-9_-]{1,20}$/;
  if (!pattern.test(username)) {
    return res.status(400).json({
      error:
        "Username should be 1–20 characters, using letters, numbers, _ or -.",
    });
  }

  //   validate email formats
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "email format is wrong" });
  }

  // * Adding new users to our db table - users
  try {
    const db = await getDBConnection();
    const params = [email, username];

    // select that entry from table where email n username matches provided email & username
    const userExists = await db.get(
      `
     select id from users 
     where email = ? or username = ?
     `,
      params
    );

    // if user exists in db
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email or username already in use." });
    }

    //* handeling security concerns with bcrypt

    // hashing pass --> more secured random pass
    const hashedPass = await bcrypt.hash(password, 10);

    // if user doesn't exists in db --> insert POSt data-entry to users table
    const placeholderActualValues = [name, email, username, hashedPass];
    const userEntryAddedToDB = await db.run(
      `
      insert into users (name,email,username,password)
        values (?,?,?,?)
      `,
      placeholderActualValues
    );

    // ! Extracting and storing last user entry to session
    // fetching last user id that added to db
    const { lastID } = userEntryAddedToDB;

    // --> storing that id in session
    req.session.userId = lastID;

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

//! handles login function executed by authRouter on desired route
export async function loginUser(req, res) {
  // trimming to make sure no-whitespace conflicts any errors
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  // validate if all input-fields are there completed
  if (!username || !password) {
    return res.status(401).json({ error: "All fields are required" });
  }

  try {
    const db = await getDBConnection();
    // validate user details --> if this entry of user's data exists in db user table
    // * found that user entry --> object stores pass,name properties etc... of that user
    const userFound = await db.get(
      `
     select id,username,password from users
       where username = ?
     `,
      [username]
    );

    // if failed to validate user -> this test failed
    if (!userFound) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // pass validation with bcryptjs pkg (enteredPass, pass stored of that user in db user table)
    const validatePass = await bcrypt.compare(password, userFound.password);
    // if failed to validate password
    if (!validatePass) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // if nothing breaks the flow (validates from db <---->successfuly logged in)
    // * validates & creates session with id that is found from found user
    req.session.userId = userFound.id;

    // added return fror consistency purpose only!
    return res.json({ message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
}

// refrence purpose only
// body : {
//   name: 'someName',
//   email: 'somemail@gmail.com',
//   username: 'someUsername',
//   password: 'somePassword'
// }

//! handles log out functionality
export async function logoutUser(req, res) {
  //* .destroy(cb fnc --> checks for err , if not --> sends jsonRes)
  req.session.destroy((err) => {
    // if caught error while loggin out
    if (err) {
      console.error(err);
      res.status(400).json({ error: "failed to log out" });
    }

    // if logged out successfully
    res.json({ message: "Logged out" });
  });
}
