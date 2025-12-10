import express from "express";
import { productsRouter } from "./routes/product.js";
import { authRouter } from "./routes/auth.js";
const app = express();
// express code is executed from top to bottom 👇
// next --> component of middleware --> gets called when fn of middlewar (app.use) is completed
// !as code is executed from top to bottom --> so then by order --> 1st,2nd mw executed
// * this built-in express middleware (MW/mw) is called -->
// serves the content from finding html file from dir mentioned
app.use(express.static("public"));
// then this get request if made*
app.get("/", (req, res) => {
  res.send("<!doctype html><html><body>Hello Express!</body></html>");
});

// handles routing from Productsrouter
app.use("/api/products", productsRouter);

// handles incoming chunks of body/data from client to server
// * collects all chunks --> turn into body --> pass body to request object
app.use(express.json()); //--> if successfully parsed, calls next() --> invokes the next mw fnc

// handles sign-in/up routes from authRouter
app.use("/api/auth", authRouter);

app.listen(8000, () => console.log("listening 8000"));
