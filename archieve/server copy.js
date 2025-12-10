import express from "express";

const app = express();
// express code is executed from top to bottom 👇
// next --> component of middleware --> gets called when fn of middlewar (app.use) is completed
// * 1st middleware (MW/mw)
app.use((req, res, next) => {
  console.log("request headers have been added");

  //   next is invoked when mw fnc is completed
  next();
});

// * 2nd middleware (MW/mw)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// !as code is executed from top to bottom --> so then by order --> 1st,2nd mw executed
// then this get request if made* 
app.get("/", (req, res) => {
  res.send("<!doctype html><html><body>Hello Express!</body></html>");
});

app.listen(8000, () => console.log("listening 8000"));
