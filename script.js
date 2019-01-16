// BOARD CONTROLLER
var boardController = (function() {
    var Note = function(id, title, body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.date = new Date();
    }

    Note.prototype.update = function(title, body) {
        this.title = title;
        this.body = body;
    }

    var items = [];

    return {
        addNote: function(title, body) {
            var note, id;

            if (items.length > 0) {
                id = items[items.length - 1].id + 1;
            } else {
                id = 0;
            }

            note = new Note(id, title, body);

            items.push(note);

            return note;
        },

        deleteNote: function(id) {
            var ids, index;

            ids = items.map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                items.splice(index, 1);
            }
        },

        getNotesCounter: function() {
            return items.length
        },

        getNote: function(id) {
            for(i = 0; i < items.length; i++) {
                if(items[i].id == id)
                    return items[i];
            }
        }
    }
})();

// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputs: {
            add: {
                title: '.add__title',
                body: '.add__body'
            },
            edit: {
                title: '.edit__title',
                body: '.edit__body',
            }
        },
        inputBtn: '.add__btn',
        container: '.container',
        noteTitle: '.note__title',
        noteBody: '.note__body',
        counterContainer: '.board__notes',
        counter: '.counter',
        counterTitle: '.counter--title',
        editBtn: 'note__edit',
        deleteBtn: 'note__delete',
        applyEditBtn: 'edit__note__apply',
        cnacelEditBtn: 'edit__note__cancel'
    };

    return {
        addBoardNote: function(note) {
            var HTML, newHTML;

            HTML = '<div class="note__container" id="%id%"><div class="edit__container"><input type="text" class="edit__title" placeholder="Title" /><textarea class="edit__body" placeholder="Edit a note..."></textarea></div><div class="note__content">            <h1 class="note__title">%title%</h1><p class="note__body">%body%</p></div><div class="note__meta"><span class="note__date">%date%</span><div class="note__actions"><button type="button" class="note__edit"><span class="ion-edit" title="Edit"></span></button><button type="button" class="note__delete"><span class="ion-trash-b" title="Delete"></span></button><button type="button" class="edit__note__apply"><span class="ion-checkmark" title="Apply"></span></button><button type="button" class="edit__note__cancel"><span class="ion-close" title="Cancel"></span></button</div></div></div>';

            newHTML = HTML.replace('%id%', note.id);
            newHTML = newHTML.replace('%title%', note.title);
            newHTML = newHTML.replace('%body%', note.body);
            newHTML = newHTML.replace('%date%', moment(note.date).format('MMM D, YYYY [at] HH:mm'));

            document.querySelector(DOMstrings.container).insertAdjacentHTML('beforeend', newHTML);
        },

        editBoardNote: function(note) {
            var noteElement;

            noteElement = document.getElementById(note.id);

            noteElement.querySelector(DOMstrings.inputs.edit.title).value = note.title;
            noteElement.querySelector(DOMstrings.inputs.edit.body).value = note.body;

            noteElement.classList.toggle('editing');
        },

        deleteBoardNote: function(noteID) {
            var noteElement;

            noteElement = document.getElementById(noteID);

            noteElement.remove();
        },

        applyEditBoardNote: function(note) {
            var noteElement;

            noteElement = this.getNoteContainer(note.id);

            noteElement.querySelector(DOMstrings.noteTitle).innerHTML = note.title;
            noteElement.querySelector(DOMstrings.noteBody).innerHTML = note.body;

            noteElement.classList.toggle('editing');
            
        },

        cancelEditBoardNote: function(noteID) {
            var noteElement;

            noteElement = this.getNoteContainer(noteID);

            noteElement.classList.toggle('editing');
        },

        getNoteContainer: function(id) {
            return document.getElementById(id);
        },

        getInput: function(container, type) {
            return {
                title: container.querySelector(DOMstrings.inputs[type].title).value,
                body: container.querySelector(DOMstrings.inputs[type].body).value
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        clearFields: function() {
            document.querySelector(DOMstrings.inputs.add.title).value = "";
            document.querySelector(DOMstrings.inputs.add.body).value = "";
        },

        updateCounter: function(counter) {
            var counterContainer;

            counterContainer = document.querySelector(DOMstrings.counterContainer);
            
            counterContainer.querySelector(DOMstrings.counter).textContent = counter;
            counterContainer.querySelector(DOMstrings.counterTitle).textContent = (counter === 1 ? 'note' : 'notes');

        }
    }
})();

// GLOBAL CONTROLLER
var controller = (function(boardCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();

    var ctrlAddNote = function() {
        var input, note;

        // Get values
        input = UICtrl.getInput(document, 'add');

        if(input.body !== "") {
            // Create note
            note = boardCtrl.addNote(input.title, input.body);

            // Clear fields
            UICtrl.clearFields();

            // Add note on board
            UICtrl.addBoardNote(note);

            // Update counters
            updateCounter();
        }
    }

    var ctrlEditNote = function(id) {
        var note;

        note = boardCtrl.getNote(id);

        UIController.editBoardNote(note);
    }

    var ctrlApplyEditNote = function(id) {
        var container, input, note;

        container = UICtrl.getNoteContainer(id);

        input = UICtrl.getInput(container, 'edit');

        if(input.body !== "") {
            note = boardCtrl.getNote(id);

            note.update(input.title, input.body);

            UICtrl.applyEditBoardNote(note);
        }
    }

    var ctrlCancelEditNote = function(id) {
        UICtrl.cancelEditBoardNote(id);
    }

    var ctrlDeleteNote = function(id) { 
        
        if(confirm('Are you sure?')) {
            // Delete note from the data
            boardCtrl.deleteNote(id);

            // Deletenote from board
            UICtrl.deleteBoardNote(id);

            // Update counters
            updateCounter();
        }

    }
 
    var updateCounter = function() {
        var counter;

        counter = boardCtrl.getNotesCounter();

        UICtrl.updateCounter(counter);
    }

    var setupEventListeners = function() {

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddNote);

        document.querySelector(DOM.container).addEventListener('click', function(event) {
            var noteID, actionName;

            noteID = parseInt(event.target.parentNode.parentNode.parentNode.parentNode.id);
            if(noteID || noteID === 0) {


                actionName = event.target.parentNode.className;
                
                switch(actionName) {
                    case DOM.editBtn:
                        ctrlEditNote(noteID);
                        break;
                    case DOM.deleteBtn:
                        ctrlDeleteNote(noteID);
                        break;
                    case DOM.applyEditBtn:
                        ctrlApplyEditNote(noteID);
                        break;
                    case DOM.cnacelEditBtn:
                        ctrlCancelEditNote(noteID);
                        break;   
                }
            }
        });
    }

    return {
        init: function() {
            console.log('Application has started.');

            updateCounter();
            setupEventListeners();
        }
    }
})(boardController, UIController);

controller.init();