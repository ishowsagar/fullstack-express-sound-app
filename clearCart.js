import { getDBConnection } from "./db/db.js";

async function clearCart() {
  const db = await getDBConnection();
  await db.run("DELETE FROM cart_items");
  console.log("✅ All cart items deleted");
  await db.close();
}

clearCart();
