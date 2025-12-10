import { getDBConnection } from "../db/db.js";
export async function getGenres(req, res) {
  try {
    const db = await getDBConnection();
    const query = `select distinct genre from products`;
    const genres = await db.all(query);
    // * front-end expects only genre values --> but not whole obj ({genre: "rock"}) and also strings val
    const val = genres.map((row) => row.genre);
    res.json(val);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch genres", details: err.message });
  }
  // console.log("genres");
}
export async function getProducts(req, res) {
  // console.log("products");

  try {
    const db = await getDBConnection(req, res);
    let query = `select * from products`;
    const { genre, search } = req.query;

    // * accounting in for client made selection from drop-down menu and search also exists

    // handles both genre and search
    if (genre && search) {
      query = `select * from products where genre = ? and
       ( title like ? or artist like ?)
      `;
      // * what those placeholders values would be --> array of potential genres
      const searchPatterns = `%${search}%`;
      const pattern = [genre, searchPatterns, searchPatterns];
      const getAllProducts = await db.all(query, pattern);
      res.json(getAllProducts);
    }

    // handles only genre
    else if (genre) {
      query = `select * from products where genre = ?`;
      const pattern = [genre];
      const getAllProducts = await db.all(query, pattern);
      res.json(getAllProducts);
    }

    // * else if client searched in for something in input bar --> gets stored into query params as search
    else if (search) {
      // select those entries from table where the search str is contained --> in that entry
      query = `
      select * from products
        where title like ? or artist like ? or genre like ?
      `;
      const searchPattern = `%${search}%`;
      const searchParams = [searchPattern, searchPattern, searchPattern];
      const getSearchedProductsOnly = await db.all(query, searchParams);
      res.json(getSearchedProductsOnly);
    }

    // handles when nothing is searched or drop-down menu is used
    else {
      const getAllProducts = await db.all(query);
      res.json(getAllProducts);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
}
