import validator from "validator";
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
}

// refrence purpose only
// body : {
//   name: 'someName',
//   email: 'somemail@gmail.com',
//   username: 'someUsername',
//   password: 'somePassword'
// }
