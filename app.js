//Budget Controler
var budgetController = (function() {
	
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

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
		percentage: -1
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//Create New ID
			if (data.allItems[type].length > 0) {

				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

			} else {
				ID = 0;
			}

			//Create New Item based on inc and exp type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			}else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//Push into data structure
			data.allItems[type].push(newItem);
			data.totals[type] += newItem.value;

			//Return new element
			return newItem;
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
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentg: data.percentage
			};
		},
		testing: function() {
			console.log(data);
		}
	}

})();

//UI Controller
var UIController = (function() {

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
		percentageLabel: '.budget__expenses--percentage'
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
				html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {

				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}

			//Replace Placeholder text with actual data
			newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value);

			//Insert HTML into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
			if (obj.budget > -1) {
				document.querySelector(DOMstrings.budgetLabel).textContent = '+ '+obj.budget;
			} else {
				document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			}
			document.querySelector(DOMstrings.incomeLabel).textContent = '+ '+obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = '- '+obj.totalExp;
			if (obj.percentg > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentg+'%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '--';
			}
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

	return {
		init: function() {
			console.log('Application has sttarted');
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