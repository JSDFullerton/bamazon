-- CREATING SQL DB OR DROPPING IF ALREADY EXISITS
DROP DATABASE IF EXISITS bamazonDB;
CREATE DATABASE bamazonDB;

-- USE THE DB CREATED
USE bamazonDB;

-- CREATE TABLE w/ COL HEADERS
CREATE TABLE products (
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(10) NOT NULL,
	department_name VARCHAR(10) NOT NULL,
	price INTEGER(5) NOT NULL,
	inventory_quantity(5) NOT NULL,
	PRIMARY KEY item_id


);

-- CREATE VALUES/PRODUCTS
INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Deku Nuts", "Forrest_Temple", 5, 50);

INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Fairy Bow", "Forrest_Temple", 50, 10);

INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Orcarina of Time", "Temple_of_Time", 100, 3);

INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Long Shot", "Shadow_Temple", 30, 15);

INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Arrows", "Hyrule", 15, 100);

INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Hylian Sheild", "Hyrule", 40, 80);

INSERT INTO products (product_name, department_name, price, inventory_quantity)
VALUES ("Lens of Truth", "Shadow_Temple", 50, 5)




