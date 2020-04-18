//Budget Controler
const budgetController = (function() {
	
	class Expense {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
			this.percentage = -1;
		}
		calcPerc(totalIncome) {
			if (totalIncome > 0) {
				this.percentage = Math.round((this.value / totalIncome) * 100);
			}
			else {
				this.percentage = -1;
			}
		}
		getPerc() {
			return this.percentage
		}
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1,
		count: 0
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//Create New ID
			ID = data.count;
			data.count += 1;

			//Create New Item based on inc and exp type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			}else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//Push into data structure
			data.allItems[type].push(newItem);

			//Update Total
			data.totals[type] += newItem.value;

			//Return new element
			return newItem;
		},

		deleteItem: function(type, id) {

			var ids, index;
			ids = data.allItems[type].map(function(current) {
				return current.id
			});
			index = ids.indexOf(id);
			if (index !== -1) {
				//Update Total
				data.totals[type] -= data.allItems[type][index].value;
				//Delete from Data Structure
				data.allItems[type].splice(index, 1);
			}

		},

		calculateBudget: function(){

			//Calculate total Income and Expenses
			data.totals.inc;
			data.totals.exp;

			//Calculate Budget: Income - Expenses
			data.budget = data.totals.inc - data.totals.exp;
			//Calculate Percentage of Income spent
			if (data.totals.exp > 0){
				data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
			}

		},

		calculateLittlePercentage: function(){

			data.allItems.exp.forEach(function(cur) {
				cur.calcPerc(data.totals.inc);
			});
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentg: data.percentage
			};
		},

		getLittlePercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPerc();
			});
			return allPerc;
		},

		testing: function() {
			console.log(data);
		}
	}

})();

//UI Controller
const UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesLittlePercentageLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type) {
		var numSplit, integer, decimal, stringLength, n;
		// + or - before a number
		// Exactly 2 decimal points 
		// Comma seperating the thousands
		// 2000 -> 2,000.00

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		integer = numSplit[0];
		stringLength = integer.length;
		n = 0
		while (stringLength > 3) {
			stringLength -= 3
			n += 3
			integer = integer.substr(0, stringLength) + ',' + integer.substr(stringLength, n);	
			n += 1
		}

		decimal = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + integer + '.' + decimal

	}; 

	var nodeListForEach = function(list, callback) {
		for(var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, //Either inc or expe
				description:  document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		addListItem: function(obj, type){
			var html, newHtml, element;
			// Create HTML string with placeholder text
			if (type === 'inc'){

				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {

				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}

			//Replace Placeholder text with actual data
			newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%',formatNumber(obj.value, type));

			//Insert HTML into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorID) {
			
			var element;
			element = document.getElementById(selectorID);
			element.parentNode.removeChild(element);

		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(cur, i, arr) {
				cur.value = "";
			});

			fieldsArr[0].focus();
		},
		displayBudget: function(obj){
			var type
			obj.budget > -1 ? type = 'inc' : type = 'exp'
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentg > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentg+'%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '--';
			}
		},
		
		displayLittlePercentages: function(littlePercentages) {
			var fields;

			fields = document.querySelectorAll(DOMstrings.expensesLittlePercentageLabel);

			nodeListForEach(fields, function(cur, index){
				if (littlePercentages[index] > 0){
					cur.textContent = littlePercentages[index] + '%';
				} else {
					cur.textContent = '--';
				}
			});
		},

		changedType: function() {
			var fields;

			fields = document.querySelectorAll(
				DOMstrings.inputType + ', ' +
				DOMstrings.inputDescription + ', ' +
				DOMstrings.inputValue
			);

			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
		},

		displayMonth: function() {
			var now, year, month, calendar;

			now = new Date();
			calendar = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			
			year = now.getFullYear();
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = calendar[month] + ' ' + year;
		},

		getDOMstrings: function(){
			return DOMstrings;
		} 
	};

})();

//Global App Controller
const controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		
		document.addEventListener('keypress', function(event) {
			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};

	var ctrlAddItem = function(){
		var input, newItem;
		//1. Get the field input data
		input = UICtrl.getInput();

		//Check for validity of data
		if (input.description !== "" && !isNaN(input.value) && input.value > 0){
				//2. Add item to budget controller
				newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		
				//3. Add item to UI
				UICtrl.addListItem(newItem, input.type);
		
				//4 Clear the fields
				UICtrl.clearFields();
		
				//5. Calculate and Update budget
				updateBudget();

				//6. Calculate and Update Little Percentage
				updateLittlePercentage();
			}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
		//This works only if there is no great grand child node that has an ID, 
		//I don't believe this is efficient. 
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1. Delete Item from data structure
			budgetCtrl.deleteItem(type, ID);

			//2. Delete Item from UI
			UICtrl.deleteListItem(itemID);

			//3. Update Item on UI
			updateBudget();

			//4. Calculate and Update Little Percentage
			updateLittlePercentage();
		}
	};

	var updateBudget = function(){
		var budget;

		//1. Calculate Budget
		budgetCtrl.calculateBudget();

		//2. Return the Budget
		budget = budgetCtrl.getBudget();

		//3. Display Budget
		UICtrl.displayBudget(budget);
	}

	var updateLittlePercentage = function() {
		
		//1. Calculate Percentages
		budgetCtrl.calculateLittlePercentage();

		//2. Read tthem from budget controller
		var littlePercentages = budgetCtrl.getLittlePercentages();

		//3. Update UI
		UICtrl.displayLittlePercentages(littlePercentages);
	}

	return {
		init: function() {
			console.log('Application has started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentg: -1
			});
			setupEventListeners();
		}
	}

})(budgetController, UIController);

controller.init();