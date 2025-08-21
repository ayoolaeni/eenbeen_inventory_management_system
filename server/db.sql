-- 1. Warehouse
CREATE TABLE warehouse (
    warehouse_id BIGSERIAL PRIMARY KEY,
    warehouse_name VARCHAR(250) NOT NULL,
    location VARCHAR(250)
);

-- 2. Product
CREATE TABLE product (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(250) NOT NULL,
    description VARCHAR(250),
    price NUMERIC(12,2) NOT NULL,
    warehouse_id BIGINT REFERENCES warehouse(warehouse_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Inventory
CREATE TABLE inventory (
    inventory_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(product_id) ON DELETE CASCADE,
    warehouse_id BIGINT REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, warehouse_id)
);

-- 4. Customer
CREATE TABLE customer (
    customer_id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(250) NOT NULL,
    contact_info VARCHAR(250) NOT NULL,
    address VARCHAR(250)
);

-- 5. Purchase (buying adds stock)
CREATE TABLE purchase (
    purchase_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(product_id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    customer_id BIGINT REFERENCES customer(customer_id) ON DELETE SET NULL,
    warehouse_id BIGINT REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    total_cost NUMERIC(12,2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW()
);

-- 6. Sales (selling reduces stock)
CREATE TABLE sales (
    sales_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(product_id) ON DELETE CASCADE,
    warehouse_id BIGINT REFERENCES warehouse(warehouse_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    total_sale NUMERIC(12,2) NOT NULL,
    sales_date TIMESTAMP DEFAULT NOW()
);

-- 7. Users (for login/auth)
CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'sales', -- 'admin' or 'sales'
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Sample Data (consistent with new schema)
-- ============================================

-- Warehouse
INSERT INTO warehouse (warehouse_name, location) VALUES
('Main Warehouse', 'Ipaja');

-- Product
INSERT INTO product (product_name, description, price, warehouse_id)
VALUES ('Smartphone', 'Latest model smartphone', 699.99, 1);

-- Inventory
INSERT INTO inventory (product_id, warehouse_id, quantity)
VALUES (1, 1, 100);

-- Customer
INSERT INTO customer (customer_name, contact_info, address) VALUES
('Francis Israel', 'francis@example.com', '456 Unilag, Lagos State');

-- Purchase
INSERT INTO purchase (product_id, vendor_name, customer_id, warehouse_id, quantity, total_cost)
VALUES (1, 'TechVendor Ltd', 1, 1, 5, 3500);

-- Sales
INSERT INTO sales (product_id, warehouse_id, quantity, total_sale)
VALUES (1, 1, 2, 1399.98);
