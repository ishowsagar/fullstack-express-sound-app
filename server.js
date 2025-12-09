import express from "express";
import { productsRouter } from "./routes/product.js";
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

// handles routing from router
app.use("/api/products", productsRouter);
app.listen(8000, () => console.log("listening 8000"));

