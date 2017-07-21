// REQUIRED PACKAGES
	var mysql = require("mysql");
	var inquirer = require("inquirer");
	var table = require('cli-table');

// GLOBAL VARIABLES
	var productList = [];


// MySQL CONNECTION
	var connection = mysql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "",
		database: "bamazonDB"

	});// close MySQL Connection



// CALL MySQL CONNECTION - WORKING
	connection.connect(function(error) {
		if (error) {
			console.log("SQL Connection Error: " + error );
			return;
		}
		else {
			console.log("DB Connection Established");
			console.log("---------------------------");
			console.log("++++++++++++++++++++++++++++");

			// run customerStart Funct (Inquirer Prompt)
			managerStart();
		}

	})// close call connection



// DISPLAY MANAGER OPTIONS MENU (View Product, Low Inventory, Add to Inventory, New Products
	function managerStart() {
		inquirer.prompt([

			{
			type: "list",
			name: "managerAction",
			message: "Ok boss, what would you like to do...?",
			choices: ["View Products for Sale", "Low Inventory Check", "Add to Inventory", "Add New Product"]
			}

		])// close inquier prompt
		.then(function(response) {

			console.log("MANAGER RESPONSE: " + response.managerAction);
			console.log("---------------------------");
			console.log("++++++++++++++++++++++++++++");

			switch (response.managerAction) {
				
				case "View Products for Sale":
					// run function to dipslay product table - WORKING
					displayTable();

					setTimeout(function(){
						console.log("---------------------------");
						console.log("++++++++++++++++++++++++++++");

						// run managerStart Funct - WORKING 
						managerStart();
						
					}, 500);
					break;

				
				case "Low Inventory Check":

					// run function to dipslay low inventory table - WORKING
					displayTable("item_id, product_name, price, stock_quantity","WHERE inventory_quantity <= 50");

					setTimeout(function(){
						console.log("---------------------------");
						console.log("++++++++++++++++++++++++++++");

						// run managerStart Funct - WORKING 
						managerStart();
						
					}, 500);
					break;


				case "Add to Inventory":
					displayTable();

					setTimeout(function(){
						console.log("---------------------------");
						console.log("++++++++++++++++++++++++++++");

						// run managerStart Funct - WORKING 
						addToInventory();
						
					}, 500);
					break;


				case "Add New Product":
					addNewItem();
					break;

			}// close switch function
		});// close .then function
	}// managerStart function)



// DISPLAY FULL PRODUCT TABLE/VIEW PRODUCTS FOR SALE FUNC
	function displayTable(search, where) {

		connection.query("SELECT * FROM products", function(error, response) {

			if (error) {
				console.log ("Error MySQL Connection: Display Table: " + error);
				return;
			}

			else {
				// npm package to create & display product table
				var productTable = new table({
					head: ["ID", "NAME", "DEPARTMENT", "Price ($)", "Quantity in Stock"],
					colWidths: [5, 20, 20, 20, 20]
				});


			}// close else statment

			// pull response for every product item in SQL into Table
			for (var i = 0; i < response.length; i++) {
				productList.push([response[i].item_id,response[i].product_name,response[i].department_name,response[i].price,response[i].inventory_quantity,response[i].product_sales]);
	        	productTable.push([response[i].item_id,response[i].product_name,response[i].department_name,response[i].price.toFixed(2),response[i].inventory_quantity]); 

			}// close for loop

			console.log(productTable.toString());

		}) // close SQL query request	

	}// close displayTable Funct




// ADD TO INVENTORY FUNCT
	function addToInventory() {

	// Connect to SQL to Pull Current Products
		connection.query("SELECT * FROM products", function(error, response) {
			if(error) {
				console.log("ERROR w/ buyProduct Funct" + error);
				return;
			}

			inquirer.prompt([
				{
					type: "input",
					name: "productID",
					message: "Enter the ID of the product add inventory for...",

				},
				{
					type: "input",
					name: "quantity",
					message: "How many do you want add?"
				}

			])// close inquirer
			.then(function(response){

				var itemToAddID = parseInt(response.productID);
				var addedQuantity = parseInt(response.quantity);
				var addingItemName = "";
				var newInventory = "";



				//Check if item ID is valid - WORKING
					if (itemToAddID < 1 || itemToAddID >= productList.length) {

						console.log("Item Not Found: Please Enter Product ID Number again");
						console.log("---------------------------");
						console.log("++++++++++++++++++++++++++++");
						buyProduct();

					}// close if state

				
				//If ID Valid - display desured product ID, name, quantity & current stock - WORKING
					else {
						var addingItemName = productList[itemToAddID-1][1];
						var newInventory = parseInt((productList[itemToAddID-1][4] + addedQuantity));

						console.log("PRODUCT LIST:");
						console.log(productList);
						console.log("---------------------------");
						console.log("++++++++++++++++++++++++++++");
						
						console.log("ADDED ITEM ID: " + itemToAddID);
						console.log("ADDED ITEM NAME: " + addingItemName);
						console.log("QUANTITY ADDED: " + addedQuantity);
						console.log("NEW INVENTORY: " + newInventory);
						console.log("---------------------------");
						console.log("++++++++++++++++++++++++++++");
				
					}// close else state

				// Update SQL w/ New Inventory
					connection.query("UPDATE products SET ? WHERE ?", [

						{inventory_quantity: newInventory},
						{item_id: itemToAddID}

					],
						function(error, response) {
							if (error) {
								console.log("ERRROR PUSHING ADDED INVENTORY " + error);
								return;
							}
						}

					);// close SQL push query



		})// close .then funct
		})// close SQL query pull products
	}// close addToInventory funt



// ADD NEW PRODUCT FUNCT
	function addNewItem() {

	//Connect to SQL to Pull Products - WORKING 
		connection.query("SELECT * FROM products", function(error, response) {
			if(error) {
				console.log("ERROR w/ buyProduct Funct" + error);
				return;
			}

			console.log("HYLIAN SHOPKEEP: Well what item should we add....?")
			console.log("---------------------------");

			inquirer.prompt([
				{
					type: "input",
					name: "newProductName",
					message: "Enter the name of the product you'd like to add",

				},
				{
					type: "rawlist",
					name: "newProductDepart",
					message: "Which department should sell this item?",
					choices: ["Hyrule", "Forrest_Temple", "Shadow_Temple", "Temple_of_Time"]
				},
				{
					type: "input",
					name: "quantity",
					message: "How many do you want to sell?"
				},
				{
					type: "input",
					name: "price",
					message: "How much should it cost?"
				}

			])// close inquirer
			.then(function(response){


				var newItemID = (productList.length + 1); 
				var newItemName = response.newProductName;
				var newItemDept = response.newProductDepart;
				var newItemPrice = parseInt(response.price);
				var newItemQuantity = parseInt(response.quantity);
				var newItemCost = parseFloat(0 - newItemQuantity * parseFloat(newItemPrice));


				console.log("---------------------------");
				console.log("SOLD ITEM: " + newItemName);
				console.log("DEPARMENT: " + newItemDept);
				console.log("SOLD QUANTITY: " + newItemQuantity);
				console.log("PRICE: " + newItemPrice);
				console.log("TOTAL MONEY EARNED: " + parseFloat(newItemPrice * newItemQuantity));


				console.log("PRODUCT LIST LENGTH: " + productList.length)
				console.log("NEW ITEM ID: " + newItemID)



			// UPDATE SQL W/ NEW ITEM (NAME, DEPARTMENT, PRICE, QTY) - WORKING 

				connection.query("INSERT INTO products SET ?", {

					product_name: newItemName,
					department_name: newItemDept,
					price: parseFloat(newItemPrice).toFixed(2),
					inventory_quantity: parseFloat(newItemQuantity).toFixed(2),
					product_sales: newItemCost



				});// close SQL query new product push

					console.log("---------------------------");
					console.log("HUZZAAH!!! Now we can sell " + newItemQuantity + " " + newItemName + "(s)");
			
			});// close .then funct
		});// close SQL query request
}// close sellProduct funct