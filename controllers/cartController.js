import { getDBConnection } from "../db/db.js";
export async function addToCart(req, res) {
  const db = await getDBConnection();
  const productId = parseInt(req.body.productId, 10);

  // if product id is invalid
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  //   fetching userId  from current active session
  const userId = req.session.userId;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Please log in to add items to cart" });
  }

  //   check if already that product is added  from that user -->
  // --> update quantity of selected product by 1

  const addedProduct = await db.get(
    `
    select * from cart_items
        where user_Id = ? and product_id = ?
    `,
    [userId, productId]
  );

  if (addedProduct) {
    await db.run(
      `
        update cart_items set quantity = quantity + 1 
            where id = ?
        `,
      [addedProduct.id]
    );
  }

  //   if its first time client selected and added product to cart --> insert those entry'values to cart_items
  else {
    await db.run(
      `
        insert into cart_items (user_id,product_id,quantity)
            values (?,?,?)
        `,
      [userId, productId, 1]
    );
  }

  return res.json({ message: "Added to cart" });
}

// ! handles cart-count functionality for the active user
export async function getCartCount(req, res) {
  const db = await getDBConnection();
  //   current user's user_id
  const userId = req.session.userId;
  if (!userId) {
    console.error("log in first");
  }

  const foundProductQuantity = await db.get(
    `
        select sum(quantity) as totalItems from cart_items 
            where user_id = ?
        `,
    [userId]
  );
  return res.json({ totalItems: foundProductQuantity.totalItems || 0 });
}

// ! handles cart-icon clicked --> list all selected products
export async function getAll(req, res) {
  const db = await getDBConnection();

  const items = await db.all(
    `SELECT ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?`,
    [req.session.userId]
  );

  res.json({ items: items });
}

// export async function getAll(req, res) {
//   const db = await getDBConnection();
//   const userId = req.session.userId;

//   //   selecting those entries which also exists in products table
//   //   joining cause --> get specific entries values from that table --> for entries exists there
//   const getAllItems = await db.all(
//     `
//     select ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price  from cart_items ci
//         join products p on p.id = ci.product_id
//             where ci.user_id = ?
//     `,
//     [userId]
//   );
//   return res.json({ items: getAllItems });
// }

// !handles deleting item from cart storage*
export async function deleteItem(req, res) {
  const db = await getDBConnection();

  const itemId = parseInt(req.params.itemId, 10);

  if (isNaN(itemId)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  const item = await db.get(
    "SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?",
    [itemId, req.session.userId]
  );

  if (!item) {
    return res.status(400).json({ error: "Item not found" });
  }

  //   deleting that entry from table ci --> of that item entry and that user's entry
  await db.run("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [
    itemId,
    req.session.userId,
  ]);

  // .send methods --> sending empty response but suucessfully deleted that entry (204 - code)
  res.status(204).send();
}

// ! handles the checkout functionality to clear items and make the order
export async function deleteAll(req, res) {
  const db = await getDBConnection();

  //   active current user in session
  const userId = req.session.userId;
  await db.run(
    `
    delete from cart_items where user_id = ?
    `,
    [userId]
  );
  res.status(204).send();
  /*
Challenge:
1. Delete all cart items for a user.
*/
}
