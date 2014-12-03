var path;
var imgs;
var menuContent;
var intRegex;
var inventoryArray;

function displayInventory() {
	resetInventory();
	loadInventory();
}

function resetInventory() {
	inventoryArray = []; 
}

// recieves all data from firebase and create a new array
function loadInventory() {
	jsonData_inv.on('child_added', function(snapshot) {
		var message = snapshot.val();
		inventoryArray.push({model: message.model, manu: message.manu, qty: message.qty});
  });
}

// displays array data on the inventory view page
function printInventory(start, end) {
	if (!intRegex.test(start) || !intRegex.test(end))
		start = 0; end = 9;
  
	$('body /deep/ #inventoryList').html('');
	if(inventoryArray.length >= end + 1) {
		for (;start < end; start++)
			$('<div/>').text(inventoryArray[start].model + "//" + inventoryArray[start].manu + "//" + inventoryArray[start].qty).appendTo($('body /deep/ #inventoryList'));
	}
}

$(document).ready(function() {
	path = { master: "http://testmf.esy.es/", img: "images/" };
	
	imgs = 	{	side_graphic_mainLogo: 		path.master + path.img + "graphic_matflow_logo_182.png",
				home_graphic_mainBanner: 	path.master + path.img + "graphic_mainPage_salesDepart.png",
				home_icon_viewOrders: 		path.master + path.img + "graphic_viewOrder.png",
				home_icon_inventory: 		path.master + path.img + "graphic_inventory.png"
			};
			
	menuContent = [	{ title: 'Inventory', image: imgs.home_icon_inventory,
						sub: [ 	{ title: 'View / Edit Stock Items', location: 'inv_view' },
								{ title: 'Add a New Stock Item', location: 'inv_add' },
								{ title: 'Manufacturer Management', location: 'inv_manu' },
								{ title: 'Category Management', location: 'inv_cat' }
						],
						info: [ { title: 'Total Inventory Count', symbol: '', number: '26,598' },
								{ title: 'Total Inventory Cost', symbol: '$', number: '785,386.20' }]
						},
					{ title: 'Orders', image: imgs.home_icon_viewOrders,
						sub: [ 	{ title: 'Placeholder', location: 'none' },
								{ title: 'Placeholder', location: 'none' },
								{ title: 'Placeholder', location: 'none' }
						],
						info: [ { title: 'Total Order Counts This Week', symbol: '', number: '568' },
								{ title: 'Total Sales This Week', symbol: '$', number: '45,658.39' }
						]
					}];
	
	invContent = [ { label: 'Model No.', inputId: 'model', key: 'model', inputType: 'string', placeholder: 'Model No.', msgDivId: 'invInputMsg_model' },
				   { label: 'Manufacturer', inputId: 'manu', key: 'manu', inputType: 'string', placeholder: 'Manufacturer', msgDivId: 'invInputMsg_manu' },
				   { label: 'Quantity', inputId: 'qty', key: 'qty', inputType: 'integer', placeholder: 'Quantity', msgDivId: 'invInputMsg_qty' }
			     ];

	tableHeader = [ 'Model No.', 'Manufacturer', 'Category', 'Qty.', 'Price', 'Edit', 'Delete' ];
	pgInterval = 30;
	
	jsonData_inv = new Firebase('https://inventories.firebaseio.com/');
	jsonData_cat = new Firebase('https://categoriesmf.firebaseio.com/');
	jsonData_manu = new Firebase('https://manufacturers.firebaseio.com/');
	
	intRegex = /^\d+$/;
});