// REQUIRED PACKAGES
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('cli-table');


// MySQL CONNECTION
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazonDB"

});// close MySQL Connection



// CALL MySQL CONNECTION
connection.connect(function(error) {
	if (error) {
		console.log("SQL Connection Error: " + error );
		return;
	}
	else {
		console.log("DB Connection Established");
		// run function to dipslay product table
		// run customerStart Funct (Inquirer Prompt)
		customerStart();
	}

})// close call connection




// USER START FUNCTION - CREATE OR BUY PRODUCT
function customerStart() {
	inquirer.prompt([

		{
		type: "list",
		name: "customerAction",
		message: "Would you like to buy or create a product?",
		choices: ["Buy Product", "Sell Product"]
		}

	])// close inquier prompt
	.then(function(response) {
		console.log("CUSTOMER RESPONSE: " + response.customerAction);


		if (response.customerAction === "Buy Product") {
			displayTable();
		}
		else {
			// run sellProduct Function
		}

	});// close .then function
}// close customerStart function






// DISPLAY PRODUCT TABLE
function displayTable() {

	var productList = [];

	connection.query("SELECT * FROM products", function(error, response) {

		if (error) {
			console.log ("Error MySQL Connection: Display Table: " + error);
			return;
		}

		else {
			// npm package to create & display product table
			var productTable = new table({
				head: ["ID", "NAME", "DEPARTMENT", "Price ($)", "Quantity in Inventory"],
				colWidths: [5, 20, 20, 10, 10]
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
			console.log("ERROR w/ purchaseProduct Funct" + error);
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
			var itemID = parseInt(response.product_id);
			var purchaseQuantity = parseInt(response.quantity);

			// Check if item ID is valid
			if (itemID < 1 || id >= productList.length) {

				console.log("------------------------");
				console.log("Item Not Found: Please Enter Product ID Number again");
				buyProduct();

			}// close if state

			var currentInventory = ??????

			if (purchaseQuantity > currentInventory) {
				console.log("------------------------");
				console.log("Not Enough of that item in stock - we only have: " + currentInventory " left");
				buyProduct();

			}// close if state

			else {
				var newInventory = currentInventory - purchaseQuantity;
				console.log("HUZZAAH!!! You purchased " + purchaseQuantity + PRODUCT NAME??????????);

				// UPDATE SQL W/ NEW QTY LEFT IN STOCK
				connection.query("UPDATE products SET ? WHERE ?", [
						{
							stock_quantity: new_qty;
						}
						{
							item_id: itemID
						}

					],
					function(error){
						if (error) {
							console.log("Error Updating SQL w/ New Qty" + error);
						}

					})// error function close

			}// close else state
			customerStart();

		})// close .then function		
	})// close MySQL querry request
}// close buyProduct funct


// SELL PRODUCT FUNCTION











