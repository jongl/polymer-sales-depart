var path;
var imgs;
var menuContent;
var intRegex;
var floatRegex;
var inventoryArray;
var manuArray;
var editElem;
var editContent;

function searchArr(searchVal, srcArr, key) {
	var tempArr = new Array();
	
	for (i = 0; i < srcArr.length; i++) {
		if (srcArr[i][key] == searchVal
			&& !checkDupKey(tempArr, key, srcArr[i][key]))
			tempArr.push(srcArr[i]);
	}
	return tempArr;
}

function loadEditPage(elm, content, pg) {
	editElem = elm;
	editContent = content;
	switchPage(pg);
}

function reloadInventory() {
	inventoryArray = new Array();
	jsonData_inv.on('child_added', function(snapshot) {
		loadArray(snapshot.val(), inventoryArray, invContent, invContentCheck_key);
	});
	
	jsonData_inv.on('child_removed', function(snapshot) {
		loadArray(snapshot.val(), inventoryArray, invContent, invContentCheck_key);
	});
}

function getHourMinSec() {
	var date = new Date();
	var hour = date.getHours().toString();
	var min = date.getMinutes().toString();
	var sec = date.getSeconds().toString();
	var hourChars = hour.split('');
	var minChars = min.split('');
	var secChars = sec.split('');
	return (hourChars[1] ? hour: "0" + hourChars[0]) + '-' + (minChars[1] ? min: "0" + minChars[0]) + '-' + (secChars[1] ? sec: "0" + secChars[0]);
}

function getDateStr() {
	var date = new Date();
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString();
	var dd = date.getDate().toString();
	var mmChars = mm.split('');
	var ddChars = dd.split('');
	return (mmChars[1] ? mm: "0" + mmChars[0]) + '-' + (ddChars[1] ? dd: "0" + ddChars[0]) + '-' + yyyy;
}

function reloadManu() {
	manuArray = new Array();
	jsonData_manu.on('child_added', function(snapshot) {
		loadArray(snapshot.val(), manuArray, manuContent, manuContentCheck_key);
	});
	
	jsonData_manu.on('child_removed', function(snapshot) {
		loadArray(snapshot.val(), manuArray, manuContent, manuContentCheck_key);
	});
}

function loadArray(message, targetArr, contentArr, checkKey) {
	var temp = new Array();
	var key;
	
	for (i = 0; i < contentArr.length; i++) {
		key = contentArr[i][checkKey];
		temp[key] = message[key];
	}
	
	
	for (j = 0; j < commonContent.length; j++) {
		key = commonContent[j][commonContentCheck_key];
		temp[key] = message[key];
	}
	
	
	// 여기에 common attribute 추가
	//
	//commonContent
	
	targetArr.push(temp);
}

function checkDupKey(targetArr, key, elem) {
	var i = 0;
	var check = false;
	while (!check && i < targetArr.length) {
		if (targetArr[i][key] == elem)
			check = true;
		else
			i++;
	}
	return check;
}

function trimArray(targetArr, srcArr, startIdx, endingIdx, key, max) {
	targetArr = new Array();
	//var starting = this.pgIndex * this.pgInterval;
	//var ending = (this.pgIndex + 1) * this.pgInterval - 1;
	//var max = this.inventoryArray.length;
	//var key = this.invContent[this.invContentCheck_index][this.invContentCheck_key];

	if (startIdx <= max) {
		if (endingIdx > max)
			endingIdx = max;
		
		for (j = startIdx; j <= endingIdx; j++) {
			if (!checkDupKey(targetArr, key, srcArr[j][key]))
				targetArr.push(srcArr[j]);
		}
	}
	
	return targetArr;
}

/*
function checkDupElem(src, targetArray, checkKey) {
	var ret = false;
	var i = 0;
	var imax = targetArray.length;
	var key = checkKey;
	if (imax != 0) {
		while ((!ret) && (i < imax)) {
			if (targetArray[i][key] == src)
				ret = true;
			else
				i++;
		}
	}
	return ret; 
}
*/
$(document).ready(function() {
	path = { master: "http://testmf.esy.es/", img: "images/" };
	
	imgs = 	{	side_graphic_mainLogo: 		path.master + path.img + "graphic_matflow_logo_182.png",
				home_graphic_mainBanner: 	path.master + path.img + "graphic_mainPage_salesDepart.png",
				home_icon_viewOrders: 		path.master + path.img + "graphic_viewOrder.png",
				home_icon_inventory: 		path.master + path.img + "graphic_inventory.png",
				inv_icon_inventory:			path.master + path.img + "icon_edit.png"
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
						sub: [ 	{ title: 'View / Edit Orders', location: 'none' },
								{ title: 'Place a New Order', location: 'none' },
								{ title: 'Shipping Methods', location: 'none' },
								{ title: 'View Statistics', location: 'none' }
						],
						info: [ { title: 'Total Order Counts This Week', symbol: '', number: '568' },
								{ title: 'Total Sales This Week', symbol: '$', number: '45,658.39' }
						]
					}];
	
	tableTrIdPrefix = 'tr';
	
	invContent = [ { label: 'Model No.', inputId: 'model', key: 'model', inputType: 'string', placeholder: 'Model No.', msgDivId: 'invInputMsg_model' },
				   { label: 'Manufacturer', inputId: 'manu', key: 'manu', inputType: 'string', placeholder: 'Manufacturer', msgDivId: 'invInputMsg_manu' },
				   { label: 'Category', inputId: 'cat', key: 'cat', inputType: 'string', placeholder: 'Category', msgDivId: 'invInputMsg_cat' },
				   { label: 'Quantity', inputId: 'qty', key: 'qty', inputType: 'integer', placeholder: 'Number Only', msgDivId: 'invInputMsg_qty' },
				   { label: 'Price', inputId: 'price', key: 'price', inputType: 'float', placeholder: 'Number Only', msgDivId: 'invInputMsg_price' },
				   { label: 'Comment', inputId: 'comment', key: 'comment', inputType: 'textarea', placeholder: 'Please enter comment here...', msgDivId: 'invInputMsg_comment' }
			     ];
	invContentCheck_index = 0;
	invContentCheck_key = 'key';
	manuContentKey_model = invContent[0][invContentCheck_key];
	
	// work on fixing invContent first and apply to manuContent
	commonContent = [ { label: 'Date', inputId: 'date', key: 'date', inputType: 'date', placeholder: 'Date', msgDivId: 'manuInputMsg_date' },
				      { label: 'Key', inputId: 'key', key: 'key', inputType: 'string', placeholder: 'Key', msgDivId: 'manuInputMsg_key' },
				    ];
	commonContentCheck_key = 'key';
	commonContentKey_date = commonContent[0][commonContentCheck_key];
	commonContentKey_key = commonContent[1][commonContentCheck_key];
	
	tableHeader_items = [ 'Model No.', 'Manufacturer', 'Category', 'Qty.', 'Price', 'Date', 'Edit', 'Delete' ];
	


	// common fix for manu content!!!!!!!!!!!!!!!!!!!



	
	manuContent = [ { label: 'Manufacturer', inputId: 'manu', key: 'manu', inputType: 'string', placeholder: 'Manufacturer', msgDivId: 'manuInputMsg_manu' }
				  ];
	manuContentCheck_index = 0;
	manuContentCheck_key = 'key';
	manuContentKey_manu = manuContent[0][manuContentCheck_key];
	
	tableHeader_manu = [ 'Manufacturer', 'Date', 'Edit', 'Delete' ];
	pgInterval = 10;
	
	jsonData_inv = new Firebase('https://inventories.firebaseio.com/items');
	jsonData_cat = new Firebase('https://inventories.firebaseio.com/cats');
	jsonData_manu = new Firebase('https://inventories.firebaseio.com/manu');
	
	//jsonData_inv = new Firebase('https://inventories.firebaseio.com/');
	//jsonData_cat = new Firebase('https://categoriesmf.firebaseio.com/');
	//jsonData_manu = new Firebase('https://manufacturers.firebaseio.com/');
	
	intRegex = /^\d+$/;
	floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
});