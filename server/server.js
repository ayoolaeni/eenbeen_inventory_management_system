const express = require("express");
const cors = require("cors");
const pool = require("./db")
const app = express();


//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());

//ROUTES 

//add customers
app.post("/customer",async(req,res) =>{
    try{
        const {customer_name,contact_info,address} = req.body;
        const AddCustomer = await pool.query(
            "INSERT INTO customer(customer_name,contact_info,address) VALUES($1,$2,$3) RETURNING *",
            [customer_name,contact_info,address]
        )
        
        res.json(AddCustomer.rows)

    }
    catch(err)
    {
    console.error(err.message)
    }

})

//get all the customers
app.get("/customer",async(req,res) =>{
    try {
        const allCustomers =await pool.query("SELECT * FROM customer",
            []
        )
       
        res.json(allCustomers.rows);
        
    } catch (err) {
        console.error(err.message)
    }
})

//get a customer
app.get("/customer/:id",async(req,res) =>{
    try {
        const {id} = req.params;
        const getAcustomer = await pool.query("SELECT * FROM customer WHERE customer_id = $1",
            [id]
        )
        console.log(getAcustomer.rows)
        res.json(getAcustomer.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//update  a customer
app.put("/customer/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_name, contact_info, address } = req.body;
     

        if (!customer_name || !contact_info || !address) {
            res.status(400).json({ error: "All fields are required" });
        }

        const updateCustomers = await pool.query(
            "UPDATE customer SET customer_name = $1, contact_info = $2, address = $3 WHERE id = $4 RETURNING *",
            [customer_name, contact_info, address, id]
        );

        if (updateCustomers.rows.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }

        console.log(updateCustomers.rows);
        res.json({ message: "Customer updated successfully", updatedCustomer: updateCustomers.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});
 
// delete a customer
app.delete("customer/:id",async(req,res) =>{
    try {
        const {id} = req.params;
        const removeCustomer = await pool.query("DELETE FROM customer WHERE customer_id = $1",
            [id]
        )
        res.json("deleted successifuuly")
        
    } catch (err) {
        console.error(err.message)
    }
})

//add category
app.post("/category",async(req,res) =>{
    try {
        const{category_name,description} = req.body;
        const addCategory = await pool.query(
            "INSERT INTO category(category_name,description) VALUES($1,$2) RETURNING *",
        [category_name,description]) 
     
        res.json(addCategory.rows)

    } 
    catch (err) {
        console.error(err.message)
        
    }
})

//get all the categories
app.get("/category",async(req,res)=>{
    try {
        const AllCategories = await pool.query("SELECT * FROM category",
            []
        )
        
        res.json(AllCategories.rows)
    }
     catch (err)
     {    
        console.error(err.message)
    }
})

//get a category
app.get("/category/:id",async(req,res)=>{
    try{
    const{id} = req.params;
    const OneCategory = await pool.query(
        "SELECT * FROM category WHERE category_id = $1",
    [id])
      
  res.json(OneCategory.rows)
}
catch(err)
{
throw new Error("failed to get a category")

}
})

app.put("/category/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, description } = req.body;
        const updateCategory = await pool.query(
            "UPDATE category SET category_name = $1, description = $2 WHERE category_id = $3 RETURNING *",
            [category_name, description, id]
        );

        if (updateCategory.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Updated successfully",
            category: updateCategory.rows[0],
        });
    } catch (err) {
        console.error("Error updating category:", err.message);
        res.status(500).json({ error: "Failed to update category" });
    }
});



// Delete a category
app.delete("/category/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const removeCategory = await pool.query(
            "DELETE FROM category WHERE category_id = $1 RETURNING *",
            [id]
        );

        if (removeCategory.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to delete category" });
    }
});


//posting a products
app.post("/product", async(req,res) =>{
    try {
        const {product_name,description,price} = req.body;
        const insertProducts = await pool.query(
            "INSERT INTO product(product_name,description,price) VALUES($1,$2,$3) RETURNING *",
            [product_name,description,price])

            res.json(insertProducts.rows)
    }
     catch (err) 
    {
        console.error(err.message)
    
    }
})
// getting the products
app.get("/product",async(req,res) =>{
    try {
        const allProducts = await pool.query("SELECT * FROM product",[])
        res.json(allProducts.rows)
    } 
    catch (err)
     {
        console.error(err.message)
        res.status(500).json({error:"failed to retrive the data"})
    }
})

//getting a product
app.get("/product/:id",async(req,res) =>{
    try {
        const {id} = req.params;
        const aProduct = await pool.query("SELECT * FROM product WHERE product_id = $1",[id])
        res.json(aProduct.rows)
    }
     catch (err)
     {
        console.error(err.message)
        res.status(500).json("failed  to get a required product")
    }
})

//delete  a product
app.delete("/product/:id",async(req,res) =>{
    try {
        const{id} = req.params;
        const deleteProduct = await pool.query("DELETE FROM product WHERE product_id = $1",[id])
        res.status(200).json({message:"deleted successifully"})
    }
     catch (err) 
    {
        console.error(err.message)
        res.status(500).json({error:"failed to delete the product"})
    }
})
// Update a product
app.put("/product/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const { product_name, description, price } = req.body; 

        const updateProduct = await pool.query(
            "UPDATE product SET product_name = $1, description = $2, price = $3 WHERE product_id = $4 RETURNING *",
            [product_name, description, price, id]
        );

        if (updateProduct.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" }); // If no rows are returned, the product doesn't exist
        }

        res.status(200).json(updateProduct.rows[0]); // Respond with the updated product
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to update the product" }); // Handle errors
    }
});

// Get all warehouses
app.get('/warehouses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM warehouse');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific warehouse by ID
app.get('/warehouses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM warehouse WHERE warehouse_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new warehouse
app.post('/warehouses', async (req, res) => {
    try {
        const { warehouse_name, location } = req.body;
        const result = await pool.query(
            'INSERT INTO warehouse (warehouse_name, location) VALUES ($1, $2) RETURNING *',
            [warehouse_name, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a warehouse
app.put('/warehouses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { warehouse_name, location } = req.body;
        const result = await pool.query(
            'UPDATE warehouse SET warehouse_name = $1, location = $2 WHERE warehouse_id = $3 RETURNING *',
            [warehouse_name, location, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a warehouse
app.delete('/warehouses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM warehouse WHERE warehouse_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Warehouse not found' });
        }
        res.status(200).json({ message: 'Warehouse deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all inventory items
app.get('/inventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific inventory item by ID
app.get('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM inventory WHERE inventory_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new inventory item
app.post('/inventory', async (req, res) => {
    try {
        const { product_id, quantity, warehouse_id } = req.body;
        const result = await pool.query(
            `INSERT INTO inventory (product_id, quantity, warehouse_id, last_updated)
             VALUES ($1, $2, $3, NOW()) RETURNING *`,
            [product_id, quantity, warehouse_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an inventory item
app.put('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, quantity, warehouse_id } = req.body;
        const result = await pool.query(
            `UPDATE inventory SET product_id = $1, quantity = $2, warehouse_id = $3, last_updated = NOW()
             WHERE inventory_id = $4 RETURNING *`,
            [product_id, quantity, warehouse_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an inventory item
app.delete('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM inventory WHERE inventory_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all purchases
app.get('/purchases', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM purchase');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific purchase by ID
app.get('/purchases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM purchase WHERE purchase_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new purchase
app.post('/purchases', async (req, res) => {
    try {
        const { product_id, customer_id, quantity, total_cost } = req.body;
        const result = await pool.query(
            `INSERT INTO purchase (product_id, customer_id, quantity, purchase_date, total_cost)
             VALUES ($1, $2, $3, NOW(), $4) RETURNING *`,
            [product_id, customer_id, quantity, total_cost]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a purchase
app.put('/purchases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, customer_id, quantity, total_cost } = req.body;
        const result = await pool.query(
            `UPDATE purchase SET product_id = $1, customer_id = $2, quantity = $3, total_cost = $4, purchase_date = NOW()
             WHERE purchase_id = $5 RETURNING *`,
            [product_id, customer_id, quantity, total_cost, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a purchase
app.delete('/purchases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM purchase WHERE purchase_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json({ message: 'Purchase deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all sales
app.get('/sales', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sales');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific sale by ID
app.get('/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM sales WHERE sales_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new sale
app.post('/sales', async (req, res) => {
    try {
        const { product_id, quantity, total_sale } = req.body;
        const result = await pool.query(
            `INSERT INTO sales (product_id, quantity, sales_date, total_sale)
             VALUES ($1, $2, NOW(), $3) RETURNING *`,
            [product_id, quantity, total_sale]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a sale
app.put('/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, quantity, total_sale } = req.body;
        const result = await pool.query(
            `UPDATE sales SET product_id = $1, quantity = $2, total_sale = $3, sales_date = NOW()
             WHERE sales_id = $4 RETURNING *`,
            [product_id, quantity, total_sale, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a sale
app.delete('/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM sales WHERE sales_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(200).json({ message: 'Sale deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//running the server
const port = 3000;
app.listen(port,()=>console.log(`server is running in port ${port}`))


