// const express = require("express");
// const cors = require("cors");
// const pool = require("./db"); // your pg Pool
// const app = express();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const SECRET = "supersecretkey";

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // ---------------------- helpers ----------------------
// const isPosInt = (v) => Number.isInteger(v) && v > 0;
// const now = () => new Date().toISOString();

// async function withTx(task) {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const result = await task(client);
//     await client.query("COMMIT");
//     return result;
//   } catch (e) {
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// async function getProductOr400(client, product_id) {
//   const pr = await client.query("SELECT product_id, price FROM product WHERE product_id = $1", [product_id]);
//   if (pr.rows.length === 0) {
//     const err = new Error("Product not found");
//     err.status = 400;
//     throw err;
//   }
//   return pr.rows[0];
// }

// async function upsertInventoryAdd(client, product_id, warehouse_id, qty) {
//   await client.query(
//     `INSERT INTO inventory(product_id, warehouse_id, quantity, last_updated)
//      VALUES ($1,$2,$3,NOW())
//      ON CONFLICT (product_id, warehouse_id)
//      DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity, last_updated = NOW()`,
//     [product_id, warehouse_id, qty]
//   );
// }

// async function inventorySubtractOr400(client, product_id, warehouse_id, qty) {
//   // lock row to avoid race
//   const inv = await client.query(
//     `SELECT quantity FROM inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
//     [product_id, warehouse_id]
//   );

//   if (inv.rows.length === 0 || inv.rows[0].quantity < qty) {
//     const err = new Error("Insufficient stock at warehouse");
//     err.status = 400;
//     throw err;
//   }

//   await client.query(
//     `UPDATE inventory 
//        SET quantity = quantity - $3, last_updated = NOW()
//      WHERE product_id = $1 AND warehouse_id = $2`,
//     [product_id, warehouse_id, qty]
//   );
// }

// // ---------------------- Customers ----------------------
// app.post("/customer", async (req, res) => {
//   try {
//     const { customer_name, contact_info, address } = req.body;
//     const result = await pool.query(
//       "INSERT INTO customer (customer_name, contact_info, address) VALUES ($1, $2, $3) RETURNING *",
//       [customer_name, contact_info, address]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.get("/customer", async (_req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM customer ORDER BY customer_id");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.get("/customer/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query("SELECT * FROM customer WHERE customer_id = $1", [id]);
//     if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.put("/customer/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { customer_name, contact_info, address } = req.body;
//     if (!customer_name || !contact_info || !address) return res.status(400).json({ error: "All fields are required" });
//     const result = await pool.query(
//       "UPDATE customer SET customer_name = $1, contact_info = $2, address = $3 WHERE customer_id = $4 RETURNING *",
//       [customer_name, contact_info, address, id]
//     );
//     if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
//     res.json({ message: "Customer updated successfully", customer: result.rows[0] });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.delete("/customer/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query("DELETE FROM customer WHERE customer_id = $1 RETURNING *", [id]);
//     if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------------------- Categories ----------------------
// app.post("/category", async (req, res) => {
//   try {
//     const { category_name, description } = req.body;
//     const addCategory = await pool.query(
//       "INSERT INTO category(category_name,description) VALUES($1,$2) RETURNING *",
//       [category_name, description]
//     );
//     res.status(201).json(addCategory.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to create category" });
//   }
// });

// app.get("/category", async (_req, res) => {
//   try {
//     const all = await pool.query("SELECT * FROM category ORDER BY category_id");
//     res.json(all.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to fetch categories" });
//   }
// });

// app.get("/category/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const one = await pool.query("SELECT * FROM category WHERE category_id = $1", [id]);
//     if (one.rows.length === 0) return res.status(404).json({ error: "Category not found" });
//     res.json(one.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to get category" });
//   }
// });

// app.put("/category/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category_name, description } = req.body;
//     const upd = await pool.query(
//       "UPDATE category SET category_name = $1, description = $2 WHERE category_id = $3 RETURNING *",
//       [category_name, description, id]
//     );
//     if (upd.rows.length === 0) return res.status(404).json({ message: "Category not found" });
//     res.json({ message: "Updated successfully", category: upd.rows[0] });
//   } catch (err) {
//     console.error("Error updating category:", err.message);
//     res.status(500).json({ error: "Failed to update category" });
//   }
// });

// app.delete("/category/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const del = await pool.query("DELETE FROM category WHERE category_id = $1 RETURNING *", [id]);
//     if (del.rows.length === 0) return res.status(404).json({ error: "Category not found" });
//     res.json({ message: "Category deleted successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to delete category" });
//   }
// });

// // ---------------------- Products ----------------------
// app.post("/product", async (req, res) => {
//   try {
//     const { product_name, description, price, category_id } = req.body;
//     const ins = await pool.query(
//       "INSERT INTO product(product_name,description,price,category_id) VALUES($1,$2,$3,$4) RETURNING *",
//       [product_name, description, price, category_id ?? null]
//     );
//     res.status(201).json(ins.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to create product" });
//   }
// });

// app.get("/product", async (_req, res) => {
//   try {
//     const all = await pool.query("SELECT * FROM product ORDER BY product_id");
//     res.json(all.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to retrieve products" });
//   }
// });

// app.get("/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const one = await pool.query("SELECT * FROM product WHERE product_id = $1", [id]);
//     if (one.rows.length === 0) return res.status(404).json({ error: "Product not found" });
//     res.json(one.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to get product" });
//   }
// });

// app.put("/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { product_name, description, price, category_id } = req.body;
//     const upd = await pool.query(
//       "UPDATE product SET product_name = $1, description = $2, price = $3, category_id = $4 WHERE product_id = $5 RETURNING *",
//       [product_name, description, price, category_id ?? null, id]
//     );
//     if (upd.rows.length === 0) return res.status(404).json({ error: "Product not found" });
//     res.json(upd.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to update the product" });
//   }
// });

// app.delete("/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const del = await pool.query("DELETE FROM product WHERE product_id = $1 RETURNING *", [id]);
//     if (del.rows.length === 0) return res.status(404).json({ error: "Product not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Failed to delete the product" });
//   }
// });

// // ---------------------- Warehouses ----------------------
// app.get("/warehouses", async (_req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM warehouse ORDER BY warehouse_id");
//     res.json(r.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/warehouses/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM warehouse WHERE warehouse_id = $1", [req.params.id]);
//     if (r.rows.length === 0) return res.status(404).json({ error: "Warehouse not found" });
//     res.json(r.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/warehouses", async (req, res) => {
//   try {
//     const { warehouse_name, location } = req.body;
//     const r = await pool.query(
//       "INSERT INTO warehouse (warehouse_name, location) VALUES ($1, $2) RETURNING *",
//       [warehouse_name, location]
//     );
//     res.status(201).json(r.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put("/warehouses/:id", async (req, res) => {
//   try {
//     const { warehouse_name, location } = req.body;
//     const r = await pool.query(
//       "UPDATE warehouse SET warehouse_name = $1, location = $2 WHERE warehouse_id = $3 RETURNING *",
//       [warehouse_name, location, req.params.id]
//     );
//     if (r.rows.length === 0) return res.status(404).json({ error: "Warehouse not found" });
//     res.json(r.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.delete("/warehouses/:id", async (req, res) => {
//   try {
//     const r = await pool.query("DELETE FROM warehouse WHERE warehouse_id = $1 RETURNING *", [req.params.id]);
//     if (r.rows.length === 0) return res.status(404).json({ error: "Warehouse not found" });
//     res.json({ message: "Warehouse deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------------------- Inventory (read-only endpoints) ----------------------
// app.get("/inventory", async (_req, res) => {
//   try {
//     const r = await pool.query(
//       `SELECT i.inventory_id, i.product_id, p.product_name, i.warehouse_id, w.warehouse_name,
//               i.quantity, i.last_updated
//        FROM inventory i
//        JOIN product p   ON p.product_id = i.product_id
//        JOIN warehouse w ON w.warehouse_id = i.warehouse_id
//        ORDER BY w.warehouse_name, p.product_name`
//     );
//     res.json(r.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/inventory/:id", async (req, res) => {
//   try {
//     const r = await pool.query(
//       `SELECT i.inventory_id, i.product_id, p.product_name, i.warehouse_id, w.warehouse_name,
//               i.quantity, i.last_updated
//        FROM inventory i
//        JOIN product p   ON p.product_id = i.product_id
//        JOIN warehouse w ON w.warehouse_id = i.warehouse_id
//        WHERE i.inventory_id = $1`,
//       [req.params.id]
//     );
//     if (r.rows.length === 0) return res.status(404).json({ error: "Inventory item not found" });
//     res.json(r.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // (optional) direct inventory creation/update is usually avoided; stock should flow via purchases/sales,
// // but if you want to keep them, you can leave your original POST/PUT/DELETE here.

// // ---------------------- Purchases (affect inventory +) ----------------------
// // In backend, /purchases GET
// app.get("/purchases", async (_req, res) => {
//   try {
//     const r = await pool.query(
//       `SELECT p.purchase_id, p.product_id, pr.product_name, p.vendor_name,
//               p.customer_id, p.warehouse_id, w.warehouse_name,
//               p.quantity, p.purchase_date, p.total_cost
//        FROM purchase p
//        JOIN product pr  ON p.product_id = pr.product_id
//        JOIN warehouse w ON p.warehouse_id = w.warehouse_id
//        ORDER BY p.purchase_id DESC`
//     );
//     res.json(r.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });


// app.post("/purchases", async (req, res) => {
//   const { product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost } = req.body;

//   if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });
//   if (!isPosInt(Number(warehouse_id))) return res.status(400).json({ error: "warehouse_id is required" });

//   try {
//     const result = await withTx(async (client) => {
//       const product = await getProductOr400(client, product_id);
//       const cost = total_cost ?? Number(product.price) * Number(quantity);

//       const ins = await client.query(
//         `INSERT INTO purchase (product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost, purchase_date)
//          VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`,
//         [product_id, vendor_name ?? null, customer_id ?? null, warehouse_id, quantity, cost]
//       );

//       await upsertInventoryAdd(client, product_id, warehouse_id, quantity);

//       return ins.rows[0];
//     });

//     res.status(201).json(result);
//   } catch (err) {
//     console.error(err.message);
//     res.status(err.status || 500).json({ error: err.message || "Server Error" });
//   }
// });

// app.put("/purchases/:id", async (req, res) => {
//   const { id } = req.params;
//   const { product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost } = req.body;

//   if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });

//   try {
//     const result = await withTx(async (client) => {
//       const cur = await client.query("SELECT * FROM purchase WHERE purchase_id = $1 FOR UPDATE", [id]);
//       if (cur.rows.length === 0) {
//         const e = new Error("Purchase not found");
//         e.status = 404;
//         throw e;
//       }
//       const old = cur.rows[0];

//       // roll back old inventory (+ purchase means we previously added; to edit we must remove old qty)
//       await inventorySubtractOr400(client, old.product_id, old.warehouse_id, old.quantity);

//       // validate product; compute new cost if missing
//       const product = await getProductOr400(client, product_id);
//       const cost = total_cost ?? Number(product.price) * Number(quantity);

//       const upd = await client.query(
//         `UPDATE purchase
//             SET product_id = $1, vendor_name = $2, customer_id = $3,
//                 warehouse_id = $4, quantity = $5, total_cost = $6
//           WHERE purchase_id = $7
//         RETURNING *`,
//         [product_id, vendor_name ?? null, customer_id ?? null, warehouse_id, quantity, cost, id]
//       );

//       // apply new inventory
//       await upsertInventoryAdd(client, product_id, warehouse_id, quantity);

//       return upd.rows[0];
//     });

//     res.json(result);
//   } catch (err) {
//     console.error(err.message);
//     res.status(err.status || 500).json({ error: err.message || "Server Error" });
//   }
// });

// app.delete("/purchases/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await withTx(async (client) => {
//       const cur = await client.query("SELECT * FROM purchase WHERE purchase_id = $1 FOR UPDATE", [id]);
//       if (cur.rows.length === 0) {
//         const e = new Error("Purchase not found");
//         e.status = 404;
//         throw e;
//       }
//       const row = cur.rows[0];

//       // deleting a purchase should subtract previously added stock
//       await inventorySubtractOr400(client, row.product_id, row.warehouse_id, row.quantity);

//       await client.query("DELETE FROM purchase WHERE purchase_id = $1", [id]);
//     });

//     res.json({ message: "Purchase deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(err.status || 500).json({ error: err.message || "Server Error" });
//   }
// });

// // ---------------------- Sales (affect inventory -) ----------------------
// app.get("/sales", async (_req, res) => {
//   try {
//     const r = await pool.query(
//       `SELECT s.sales_id, s.product_id, p.product_name, s.warehouse_id, w.warehouse_name,
//               s.quantity, s.sales_date, s.total_sale
//        FROM sales s
//        JOIN product p  ON p.product_id = s.product_id
//        JOIN warehouse w ON w.warehouse_id = s.warehouse_id
//        ORDER BY s.sales_id DESC`
//     );
//     res.status(200).json(r.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/sales/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM sales WHERE sales_id = $1", [req.params.id]);
//     if (r.rows.length === 0) return res.status(404).json({ error: "Sale not found" });
//     res.json(r.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/sales", async (req, res) => {
//   const { product_id, warehouse_id, quantity, total_sale } = req.body;

//   if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });
//   if (!isPosInt(Number(warehouse_id))) return res.status(400).json({ error: "warehouse_id is required" });

//   try {
//     const result = await withTx(async (client) => {
//       const product = await getProductOr400(client, product_id);
//       // check and subtract stock
//       await inventorySubtractOr400(client, product_id, warehouse_id, quantity);

//       const total = total_sale ?? Number(product.price) * Number(quantity);

//       const ins = await client.query(
//         `INSERT INTO sales (product_id, warehouse_id, quantity, sales_date, total_sale)
//          VALUES ($1,$2,$3,NOW(),$4) RETURNING *`,
//         [product_id, warehouse_id, quantity, total]
//       );

//       return ins.rows[0];
//     });

//     res.status(201).json(result);
//   } catch (err) {
//     console.error(err.message);
//     res.status(err.status || 500).json({ error: err.message || "Server Error" });
//   }
// });

// app.put("/sales/:id", async (req, res) => {
//   const { id } = req.params;
//   const { product_id, warehouse_id, quantity, total_sale } = req.body;

//   if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });

//   try {
//     const result = await withTx(async (client) => {
//       const cur = await client.query("SELECT * FROM sales WHERE sales_id = $1 FOR UPDATE", [id]);
//       if (cur.rows.length === 0) {
//         const e = new Error("Sale not found");
//         e.status = 404;
//         throw e;
//       }
//       const old = cur.rows[0];

//       // revert old sale (add stock back)
//       await upsertInventoryAdd(client, old.product_id, old.warehouse_id, old.quantity);

//       const product = await getProductOr400(client, product_id);
//       // check and subtract new stock
//       await inventorySubtractOr400(client, product_id, warehouse_id, quantity);

//       const total = total_sale ?? Number(product.price) * Number(quantity);

//       const upd = await client.query(
//         `UPDATE sales
//             SET product_id = $1, warehouse_id = $2, quantity = $3, total_sale = $4, sales_date = NOW()
//           WHERE sales_id = $5
//         RETURNING *`,
//         [product_id, warehouse_id, quantity, total, id]
//       );

//       return upd.rows[0];
//     });

//     res.json(result);
//   } catch (err) {
//     console.error(err.message);
//     res.status(err.status || 500).json({ error: err.message || "Server Error" });
//   }
// });

// app.delete("/sales/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await withTx(async (client) => {
//       const cur = await client.query("SELECT * FROM sales WHERE sales_id = $1 FOR UPDATE", [id]);
//       if (cur.rows.length === 0) {
//         const e = new Error("Sale not found");
//         e.status = 404;
//         throw e;
//       }
//       const row = cur.rows[0];

//       // deleting a sale should restore stock
//       await upsertInventoryAdd(client, row.product_id, row.warehouse_id, row.quantity);

//       await client.query("DELETE FROM sales WHERE sales_id = $1", [id]);
//     });

//     res.json({ message: "Sale deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(err.status || 500).json({ error: err.message || "Server Error" });
//   }
// });



// //Dashboard static----------------------------------------------------
// // 





// // ---------------------- server ----------------------
// const port = process.env.PORT || 3100;
// app.listen(port, () => console.log(`server is running on port ${port} @ ${now()}`));






// server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // your pg Pool
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET = "supersecretkey";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ---------------------- helpers ----------------------
const isPosInt = (v) => Number.isInteger(v) && v > 0;
const now = () => new Date().toISOString();

async function withTx(task) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await task(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function getProductOr400(client, product_id) {
  const pr = await client.query(
    "SELECT product_id, price FROM product WHERE product_id = $1",
    [product_id]
  );
  if (pr.rows.length === 0) {
    const err = new Error("Product not found");
    err.status = 400;
    throw err;
  }
  return pr.rows[0];
}

async function upsertInventoryAdd(client, product_id, warehouse_id, qty) {
  await client.query(
    `INSERT INTO inventory(product_id, warehouse_id, quantity, last_updated)
     VALUES ($1,$2,$3,NOW())
     ON CONFLICT (product_id, warehouse_id)
     DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity, last_updated = NOW()`,
    [product_id, warehouse_id, qty]
  );
}

async function inventorySubtractOr400(client, product_id, warehouse_id, qty) {
  // lock row to avoid race
  const inv = await client.query(
    `SELECT quantity FROM inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
    [product_id, warehouse_id]
  );

  if (inv.rows.length === 0 || Number(inv.rows[0].quantity) < Number(qty)) {
    const err = new Error("Insufficient stock at warehouse");
    err.status = 400;
    throw err;
  }

  await client.query(
    `UPDATE inventory 
       SET quantity = quantity - $3, last_updated = NOW()
     WHERE product_id = $1 AND warehouse_id = $2`,
    [product_id, warehouse_id, qty]
  );
}

// ---------------------- Auth middleware ----------------------
function auth(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      if (requiredRole && decoded.role !== requiredRole)
        return res.status(403).json({ error: "Access denied" });

      req.user = decoded;
      next();
    });
  };
}

// ---------------------- Customers ----------------------
app.post("/customer", async (req, res) => {
  try {
    const { customer_name, contact_info, address } = req.body;
    const result = await pool.query(
      "INSERT INTO customer (customer_name, contact_info, address) VALUES ($1, $2, $3) RETURNING *",
      [customer_name, contact_info, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/customer", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customer ORDER BY customer_id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM customer WHERE customer_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, contact_info, address } = req.body;
    if (!customer_name || !contact_info || !address)
      return res.status(400).json({ error: "All fields are required" });

    const result = await pool.query(
      "UPDATE customer SET customer_name = $1, contact_info = $2, address = $3 WHERE customer_id = $4 RETURNING *",
      [customer_name, contact_info, address, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer updated successfully", customer: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM customer WHERE customer_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- Categories ----------------------
app.post("/category", async (req, res) => {
  try {
    const { category_name, description } = req.body;
    const addCategory = await pool.query(
      "INSERT INTO category(category_name,description) VALUES($1,$2) RETURNING *",
      [category_name, description]
    );
    res.status(201).json(addCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.get("/category", async (_req, res) => {
  try {
    const all = await pool.query("SELECT * FROM category ORDER BY category_id");
    res.json(all.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const one = await pool.query("SELECT * FROM category WHERE category_id = $1", [id]);
    if (one.rows.length === 0) return res.status(404).json({ error: "Category not found" });
    res.json(one.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to get category" });
  }
});

app.put("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description } = req.body;
    const upd = await pool.query(
      "UPDATE category SET category_name = $1, description = $2 WHERE category_id = $3 RETURNING *",
      [category_name, description, id]
    );
    if (upd.rows.length === 0) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Updated successfully", category: upd.rows[0] });
  } catch (err) {
    console.error("Error updating category:", err.message);
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query("DELETE FROM category WHERE category_id = $1 RETURNING *", [id]);
    if (del.rows.length === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ---------------------- Products ----------------------
app.post("/product", async (req, res) => {
  try {
    const { product_name, description, price, warehouse_id } = req.body;
    const ins = await pool.query(
      `INSERT INTO product (product_name, description, price, warehouse_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_name, description, price, warehouse_id ?? null]
    );
    res.status(201).json(ins.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create product" });
  }
});



app.get("/product", async (_req, res) => {
  try {
    const all = await pool.query(`
      SELECT p.*, w.warehouse_name
      FROM product p
      LEFT JOIN warehouse w ON p.warehouse_id = w.warehouse_id
      ORDER BY p.product_id
    `);
    res.json(all.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});


app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const one = await pool.query("SELECT * FROM product WHERE product_id = $1", [id]);
    if (one.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(one.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to get product" });
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, description, price, warehouse_id } = req.body;
    const upd = await pool.query(
      `UPDATE product 
       SET product_name = $1, description = $2, price = $3, warehouse_id = $4 
       WHERE product_id = $5 RETURNING *`,
      [product_name, description, price, warehouse_id ?? null, id]
    );
    if (upd.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(upd.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update the product" });
  }
});



app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query("DELETE FROM product WHERE product_id = $1 RETURNING *", [id]);
    if (del.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete the product" });
  }
});

// ---------------------- Warehouses ----------------------
app.get("/warehouses", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM warehouse ORDER BY warehouse_id");
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/warehouses/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM warehouse WHERE warehouse_id = $1", [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Warehouse not found" });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/warehouses", async (req, res) => {
  try {
    const { warehouse_name, location } = req.body;
    const r = await pool.query(
      "INSERT INTO warehouse (warehouse_name, location) VALUES ($1, $2) RETURNING *",
      [warehouse_name, location]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/warehouses/:id", async (req, res) => {
  try {
    const { warehouse_name, location } = req.body;
    const r = await pool.query(
      "UPDATE warehouse SET warehouse_name = $1, location = $2 WHERE warehouse_id = $3 RETURNING *",
      [warehouse_name, location, req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "Warehouse not found" });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/warehouses/:id", async (req, res) => {
  try {
    const r = await pool.query("DELETE FROM warehouse WHERE warehouse_id = $1 RETURNING *", [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Warehouse not found" });
    res.json({ message: "Warehouse deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- Inventory (read-only endpoints) ----------------------
app.get("/inventory", async (_req, res) => {
  try {
    const r = await pool.query(
      `SELECT i.inventory_id, i.product_id, p.product_name, i.warehouse_id, w.warehouse_name,
              i.quantity, i.last_updated
       FROM inventory i
       JOIN product p   ON p.product_id = i.product_id
       JOIN warehouse w ON w.warehouse_id = i.warehouse_id
       ORDER BY w.warehouse_name, p.product_name`
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Flexible route: works for both inventory_id and warehouse_id
app.get("/inventory/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Try fetching by inventory_id first
    let r = await pool.query(
      `SELECT i.inventory_id, i.product_id, p.product_name, i.warehouse_id, w.warehouse_name,
              i.quantity, i.last_updated
       FROM inventory i
       JOIN product p   ON p.product_id = i.product_id
       JOIN warehouse w ON w.warehouse_id = i.warehouse_id
       WHERE i.inventory_id = $1`,
      [id]
    );

    if (r.rows.length > 0) {
      return res.json(r.rows[0]); // ✅ Found a single inventory item
    }

    // If not found, check if it's a warehouse_id
    r = await pool.query(
      `SELECT i.inventory_id, i.product_id, p.product_name, i.warehouse_id, w.warehouse_name,
              i.quantity, i.last_updated
       FROM inventory i
       JOIN product p   ON p.product_id = i.product_id
       JOIN warehouse w ON w.warehouse_id = i.warehouse_id
       WHERE i.warehouse_id = $1
       ORDER BY p.product_name`,
      [id]
    );

    if (r.rows.length > 0) {
      return res.json(r.rows); // ✅ Return all inventory in that warehouse
    }

    // Nothing found
    return res.status(404).json({ error: "No inventory found for given ID" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







// ---------------------- Purchases (stock +) ----------------------
app.get("/purchases", async (_req, res) => {
  try {
    const r = await pool.query(
      `SELECT p.purchase_id, p.product_id, pr.product_name, p.vendor_name,
              p.customer_id, p.warehouse_id, w.warehouse_name,
              p.quantity, p.purchase_date, p.total_cost
       FROM purchase p
       JOIN product pr  ON p.product_id = pr.product_id
       JOIN warehouse w ON p.warehouse_id = w.warehouse_id
       ORDER BY p.purchase_id DESC`
    );
    res.json(r.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/purchases", async (req, res) => {
  const { product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost } = req.body;

  if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });
  if (!isPosInt(Number(warehouse_id))) return res.status(400).json({ error: "warehouse_id is required" });

  try {
    const result = await withTx(async (client) => {
      const product = await getProductOr400(client, product_id);
      const cost = total_cost ?? Number(product.price) * Number(quantity);

      const ins = await client.query(
        `INSERT INTO purchase (product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost, purchase_date)
         VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`,
        [product_id, vendor_name ?? null, customer_id ?? null, warehouse_id, quantity, cost]
      );

      await upsertInventoryAdd(client, product_id, warehouse_id, quantity);

      return ins.rows[0];
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Server Error" });
  }
});

app.put("/purchases/:id", async (req, res) => {
  const { id } = req.params;
  const { product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost } = req.body;

  if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });

  try {
    const result = await withTx(async (client) => {
      const cur = await client.query("SELECT * FROM purchase WHERE purchase_id = $1 FOR UPDATE", [id]);
      if (cur.rows.length === 0) {
        const e = new Error("Purchase not found");
        e.status = 404;
        throw e;
      }
      const old = cur.rows[0];

      // roll back old inventory
      await inventorySubtractOr400(client, old.product_id, old.warehouse_id, old.quantity);

      // validate product; compute new cost if missing
      const product = await getProductOr400(client, product_id);
      const cost = total_cost ?? Number(product.price) * Number(quantity);

      const upd = await client.query(
        `UPDATE purchase
            SET product_id = $1, vendor_name = $2, customer_id = $3,
                warehouse_id = $4, quantity = $5, total_cost = $6
          WHERE purchase_id = $7
        RETURNING *`,
        [product_id, vendor_name ?? null, customer_id ?? null, warehouse_id, quantity, cost, id]
      );

      // apply new inventory
      await upsertInventoryAdd(client, product_id, warehouse_id, quantity);

      return upd.rows[0];
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Server Error" });
  }
});

app.delete("/purchases/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await withTx(async (client) => {
      const cur = await client.query("SELECT * FROM purchase WHERE purchase_id = $1 FOR UPDATE", [id]);
      if (cur.rows.length === 0) {
        const e = new Error("Purchase not found");
        e.status = 404;
        throw e;
      }
      const row = cur.rows[0];

      // deleting a purchase should subtract previously added stock
      await inventorySubtractOr400(client, row.product_id, row.warehouse_id, row.quantity);
      await client.query("DELETE FROM purchase WHERE purchase_id = $1", [id]);
    });

    res.json({ message: "Purchase deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Server Error" });
  }
});

// ---------------------- Sales (stock -) ----------------------
app.get("/sales", async (_req, res) => {
  try {
    const r = await pool.query(
          `SELECT s.sales_id, s.product_id, p.product_name,
            s.warehouse_id, w.warehouse_name,
            s.quantity, s.total_sale, s.sales_date
      FROM sales s
      JOIN product p ON s.product_id = p.product_id
      JOIN warehouse w ON s.warehouse_id = w.warehouse_id
      ORDER BY s.sales_date DESC`
        );
    res.status(200).json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/sales/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM sales WHERE sales_id = $1", [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Sale not found" });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sales", async (req, res) => {
  const { product_id, warehouse_id, quantity, total_sale } = req.body;

  if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });
  if (!isPosInt(Number(warehouse_id))) return res.status(400).json({ error: "warehouse_id is required" });

  try {
    const result = await withTx(async (client) => {
      const product = await getProductOr400(client, product_id);
      // check and subtract stock
      await inventorySubtractOr400(client, product_id, warehouse_id, quantity);

      const total = total_sale ?? Number(product.price) * Number(quantity);

      const ins = await client.query(
          `INSERT INTO sales (product_id, warehouse_id, quantity, sales_date, total_sale)
          VALUES ($1, $2, $3, NOW(), $4) RETURNING *`,
          [product_id, warehouse_id ?? null, quantity, total]
        );

      return ins.rows[0];
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Server Error" });
  }
});

app.put("/sales/:id", async (req, res) => {
  const { id } = req.params;
  const { product_id, warehouse_id, quantity, total_sale } = req.body;

  if (!isPosInt(Number(quantity))) return res.status(400).json({ error: "Quantity must be a positive integer" });

  try {
    const result = await withTx(async (client) => {
      const cur = await client.query("SELECT * FROM sales WHERE sales_id = $1 FOR UPDATE", [id]);
      if (cur.rows.length === 0) {
        const e = new Error("Sale not found");
        e.status = 404;
        throw e;
      }
      const old = cur.rows[0];

      // revert old sale (add stock back)
      await upsertInventoryAdd(client, old.product_id, old.warehouse_id, old.quantity);

      const product = await getProductOr400(client, product_id);
      // check and subtract new stock
      await inventorySubtractOr400(client, product_id, warehouse_id, quantity);

      const total = total_sale ?? Number(product.price) * Number(quantity);

      const upd = await client.query(
        `UPDATE sales
            SET product_id = $1, warehouse_id = $2,
                quantity = $3, total_sale = $4, sales_date = NOW()
          WHERE sales_id = $5
        RETURNING *`,
        [product_id, warehouse_id ?? null, quantity, total, id]
      );


      return upd.rows[0];
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Server Error" });
  }
});

app.delete("/sales/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await withTx(async (client) => {
      const cur = await client.query("SELECT * FROM sales WHERE sales_id = $1 FOR UPDATE", [id]);
      if (cur.rows.length === 0) {
        const e = new Error("Sale not found");
        e.status = 404;
        throw e;
      }
      const row = cur.rows[0];

      // deleting a sale should restore stock
      await upsertInventoryAdd(client, row.product_id, row.warehouse_id, row.quantity);
      await client.query("DELETE FROM sales WHERE sales_id = $1", [id]);
    });

    res.json({ message: "Sale deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Server Error" });
  }
});



// ---------------------- Users & Auth  User Management--------------------------

// Register new user (admin only)
app.post("/users", auth("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING user_id, name, email, role",
      [name, email, hashedPassword, role || "sales"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create user" });
  }
});



// GET all users (admin only)
app.get("/users", auth("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, role FROM users ORDER BY user_id ASC"
    );
    res.json(result.rows);  // 👈 return array directly
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//---------------------------------------------------------------------------------------


// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (result.rows.length === 0) return res.status(400).json({ error: "Invalid email or password" });
    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- server ----------------------
const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`server is running on port ${port} @ ${now()}`));












