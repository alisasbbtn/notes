// BOARD CONTROLLER
var boardController = (function() {
    var Note = function(id, title, body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.date = new Date();
        this.archived = false;
    }

    var data = {
        items: [],
        active: [],
        archived: []
    }

    return {
        addNote: function(title, body) {
            var note, id;

            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }

            note = new Note(id, title, body);

            data.items.push(note);
            data.active.push(note.id);

            return note;
        },

        getCounters: function() {
            return {
                active: data.active.length,
                archived: data.archived.length
            }
        }
    }
})();

// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputTitle: '.add__title',
        inputBody: '.add__body',
        inputBtn: '.add__btn',
        container: '.container',
        counterContainer: {
            active: '.board__notes--active',
            archived: '.board__notes--archived'
        },
        counter: '.counter',
        counterTitle: '.counter--title'
    }

    return {
        addBoardNote: function(note) {
            var HTML, newHTML;

            HTML = '<div class="note__container" id="note-%id%"><h1 class="note__title">%title%</h1><p class="note__body">%body%</p><div class="note__meta"><span class="note__date">%date%</span><div class="note__actions"><span class="note__edit ion-edit" title="Edit"></span><span class="note__archive ion-archive" title="Archive"></span><span class="note__delete ion-trash-b" title="Delete"></span></div></div></div>';

            newHTML = HTML.replace('%id%', note.id);
            newHTML = newHTML.replace('%title%', note.title);
            newHTML = newHTML.replace('%body%', note.body);
            newHTML = newHTML.replace('%date%', moment(note.date).format('MMM D, YYYY [at] HH:mm'));

            document.querySelector(DOMstrings.container).insertAdjacentHTML('beforeend', newHTML);
        },

        getInput: function() {
            return {
                title: document.querySelector(DOMstrings.inputTitle).value,
                body: document.querySelector(DOMstrings.inputBody).value
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        clearFields: function() {
            document.querySelector(DOMstrings.inputTitle).value = "";
            document.querySelector(DOMstrings.inputBody).value = "";
        },

        updateCounter: function(counter, type) {
            var counterContainer;

            counterContainer = document.querySelector(DOMstrings.counterContainer[type]);
            
            if(counter > 0) {
                counterContainer.style.visibility = 'visible';
                counterContainer.querySelector(DOMstrings.counter).textContent = counter;
                counterContainer.querySelector(DOMstrings.counterTitle).textContent = (counter === 1 ? 'note' : 'notes');
            } else {
                counterContainer.style.visibility = 'hidden';
            }
        }
    }
})();

// GLOBAL CONTROLLER
var controller = (function(boardCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();

    var updateCounters = function() {
        var data;

        data = boardCtrl.getCounters();

        UICtrl.updateCounter(data.active, 'active');
        UICtrl.updateCounter(data.archived, 'archived');
    }

    var setupEventListeners = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', function() {
            var input, note;
    
            // Get values
            input = UICtrl.getInput();
    
            if(input.body !== "") {
                // Create note
                note = boardCtrl.addNote(input.title, input.body);
    
                // Clear fields
                UICtrl.clearFields();
    
                // Add note on board
                UICtrl.addBoardNote(note);
    
                // Update counters
                updateCounters();
            }
        });
    }

    return {
        init: function() {
            console.log('Application has started.');

            updateCounters();
            setupEventListeners();
        }
    }
})(boardController, UIController);

controller.init();