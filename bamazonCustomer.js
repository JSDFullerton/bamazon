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



// WORKING - CALL MySQL CONNECTION
connection.connect(function(error) {
	if (error) {
		console.log("SQL Connection Error: " + error );
		return;
	}
	else {
		console.log("DB Connection Established");

		// run customerStart Funct (Inquirer Prompt)
		customerStart();
	}

})// close call connection




// WORKING - USER START FUNCTION - CREATE OR BUY PRODUCT
function customerStart() {
	inquirer.prompt([

		{
		type: "list",
		name: "customerAction",
		message: "Would you like to buy or sell a product?",
		choices: ["Buy Product", "Sell Product"]
		}

	])// close inquier prompt
	.then(function(response) {

		console.log("CUSTOMER RESPONSE: " + response.customerAction);
		console.log("---------------------------");
		console.log("++++++++++++++++++++++++++++");


		if (response.customerAction === "Buy Product") {


			// WORKING - run function to dipslay product table
			displayTable();
			console.log("---------------------------");
			console.log("++++++++++++++++++++++++++++");

			// WORKING - run buyProduct Funct
			buyProduct();


		}
		else {
			// run sellProduct Function
			sellProduct();
		}

	});// close .then function
}// close customerStart function






// DISPLAY PRODUCT TABLE
function displayTable() {

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



// BUY PRODUCT FUNCTION
function buyProduct() {
	// Connect to SQL to Pull Products
	connection.query("SELECT * FROM products", function(error, response) {
		if(error) {
			console.log("ERROR w/ buyProduct Funct" + error);
			return;
		}

		inquirer.prompt([
			{
				type: "input",
				name: "productID",
				message: "Enter the ID of the product you'd like to buy",

			},
			{
				type: "input",
				name: "quantity",
				message: "How many do you want?"
			}

		])// close inquirer
		.then(function(response){

			var purchasedItemID = parseInt(response.productID);
			var purchaseQuantity = parseInt(response.quantity);
			var purchasedItemName = "";
			var currentInventory = "";



			// WORKING - Check if item ID is valid
			if (purchasedItemID < 1 || purchasedItemID >= productList.length) {

				console.log("Item Not Found: Please Enter Product ID Number again");
				console.log("---------------------------");
				console.log("++++++++++++++++++++++++++++");
				buyProduct();

			}// close if state



			// WORKING - If ID Valid - display desured product ID, name, quantity & current stock
			else {

			var purchasedItemName = productList[purchasedItemID-1][1];
			var currentInventory = productList[purchasedItemID-1][4];

				console.log("PRODUCT LIST:");
				console.log(productList);
				console.log("---------------------------");
				console.log("++++++++++++++++++++++++++++");
				
				console.log("PURCHSED ITEM ID: " + purchasedItemID);
				console.log("PRODUCT PURCHASED: " + purchasedItemName);
				console.log("QUANTITY PURCHASED: " + purchaseQuantity);
				console.log("CURRENT STOCK: " + currentInventory);
				console.log("---------------------------");
				console.log("++++++++++++++++++++++++++++");
			
			}// close else state


			// WORKING - Check to make sure enough of Item in stock
			if (purchaseQuantity > currentInventory) {

				console.log("Not Enough of that item in stock - we only have: " + currentInventory + " left");
				console.log("---------------------------");
				console.log("++++++++++++++++++++++++++++");
				buyProduct();

			}// close else if state


			else {
				var newInventory = currentInventory - purchaseQuantity;
				var cost = parseFloat(purchaseQuantity * parseFloat(productList[purchasedItemID-1][3]));

				console.log("HUZZAAH!!! You purchased " + purchaseQuantity + " " + purchasedItemName + "(s)");
				console.log("TOTAL COST: " + cost + " Rupees");
				console.log("REMAINING INVENTORY: " + newInventory);


				// WORKING - UPDATE SQL W/ NEW QTY LEFT IN STOCK
				connection.query("UPDATE products SET ? WHERE ?", [
						{
							inventory_quantity: newInventory,
							product_sales: cost.toFixed(2)
						},
						{
							item_id: purchasedItemID
						}

					],
					function(error){
						if (error) {
							console.log("Error Updating SQL w/ New Qty" + error);
						}

					})// error function close

			}// close else state

			// Restart Function for customer Start
			customerStart();

		})// close .then function		
	})// close MySQL querry request
}// close buyProduct funct


// SELL PRODUCT FUNCTION
function sellProduct() {
	// Connect to SQL to Pull Products
	connection.query("SELECT * FROM products", function(error, response) {
		if(error) {
			console.log("ERROR w/ buyProduct Funct" + error);
			return;
		}

		console.log("SHOPKEEP: Well what da ya got to offer....?")
		console.log("---------------------------");

		inquirer.prompt([
			{
				type: "input",
				name: "newProductName",
				message: "Enter the name of the product you'd like to sell",

			},
			{
				type: "input",
				name: "quantity",
				message: "How many do you want to sell?"
			},
			{
				type: "input",
				name: "price",
				message: "How much do you want for it?"
			}

		])// close inquirer
		.then(function(response){

			var newItemName = response.newProductName;
			var newItemQuantity = parseInt(response.quantity);
			var newItemPrice = parseInt(response.price);

			console.log("SOLD ITEM: " + newItemName);
			console.log("SOLD QUANTITY: " + newItemQuantity);
			console.log("PRICE: " + newItemPrice);
			console.log("TOTAL MONEY EARNED: " + parseFloat(newItemPrice * newItemQuantity));


		});// close .then funct
	});// close SQL query request
}// close sellProduct funct










