CREATE DATABASE inventory_ms;

CREATE TABLE category (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(250) NOT NULL,
    description VARCHAR(250)
);

CREATE TABLE product (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(250) NOT NULL,
    category_id BIGINT REFERENCES category(category_id) ON DELETE SET NULL,
    description VARCHAR(250),
    price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    warehouse_name VARCHAR(250),
    location VARCHAR(250)
);

CREATE TABLE inventory (
    inventory_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(product_id),
    quantity FLOAT,
    warehouse_id INTEGER REFERENCES warehouse(warehouse_id),
    last_updated TIMESTAMP
);

CREATE TABLE customer (
    customer_id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(250) NOT NULL,
    contact_info VARCHAR(250) NOT NULL,
    address VARCHAR(250)
);

CREATE TABLE purchase (
    purchase_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(product_id),
    customer_id BIGINT REFERENCES customer(customer_id),
    quantity FLOAT,
    purchase_date TIMESTAMP,
    total_cost FLOAT
);

CREATE TABLE sales (
    sales_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(product_id),
    quantity FLOAT,
    sales_date TIMESTAMP,
    total_sale FLOAT
);


INSERT INTO category (category_name, description) 
VALUES ('Electronics', 'Devices and gadgets');

INSERT INTO product (product_name, description, price, created_at, updated_at, category_id) 
VALUES ('Smartphone', 'Latest model smartphone', 699.99, NOW(), NOW(), 1);

INSERT INTO warehouse (warehouse_name, location) 
VALUES ('Main Warehouse', 'ipagala');

INSERT INTO inventory (product_id, quantity, warehouse_id, last_updated) 
VALUES (1, 100, 1, NOW());

INSERT INTO customer (customer_name, contact_info, address) 
VALUES ('francis israel', 'francis@example.com', '456 ipagala dodoma');

INSERT INTO purchase (product_id, customer_id, quantity, purchase_date, total_cost) 
VALUES (1, 1, 2, NOW(), 12345);

INSERT INTO sales (product_id, quantity, sales_date, total_sale) 
VALUES (1, 10, NOW(), 123456);

