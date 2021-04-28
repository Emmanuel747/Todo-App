let allTodos;
let localUserData;
let pendingTodos, completedTodos, expiredTodos;

function createElementFromTodo(todo) {
//My 2nd-method for the complete button
   // let conditional = {button: ""}
   // let greenCheck = {icon: ""}
   // if (!todo.isComplete && isCurrent(todo)) {
   //    conditional.button = `<button class="action complete">Complete</button>`   
   // }
   // if (todo.isComplete) {
   //    greenCheck.icon = `<span class="compCheck" style="float:right">✔</span>`
   // }
// builds an div block from object data and returns it
   let newTodo = $('<div class="todo">').html(`
      <h3><span class="title">${todo.title}${todo.isComplete ? `<span class="compCheck" style="float:right">✅</span>` : ''}${!todo.isComplete && !isCurrent(todo) ? `<span class="compCheck" style="float:right">❌</span>` : ''}</span><span class="due-date">${todo.dueDate}</span></h3>
      <pre>${todo.description}</pre>
      <footer class="actions">
         <button class="action edit">Edit</button>
         ${!todo.isComplete && isCurrent(todo) ? `<button class="action complete">Complete</button>` : ''}
         <button class="action delete">Delete</button>
      </footer>
      </div>
   `);
   newTodo.data("todo", todo);
   return newTodo;
}

function renderTodos() {
   $("main .content").empty();
//Adds ID's to every element in allTodos
   let i = 0;
   allTodos.forEach((task) => {
      task['id'] = i; i++;
   });
   storeData();
   splitTodos();

   pendingTodos.forEach((task) => {
      const builtToDo = createElementFromTodo(task);
      $(".pending-todos").append(builtToDo);
   });
   completedTodos.forEach((task) => {
      const builtToDo = createElementFromTodo(task);
      $(".completed-todos").append(builtToDo);
      $(`#${task.id}`).addClass("done")
   });
   expiredTodos.forEach((task) => {
      const builtToDo = createElementFromTodo(task);
      $(".expired-todos").append(builtToDo);
      $(`#${task.id}`).addClass("done")
   });
}

$('#app > aside.left-drawer').on("click", function openDrawer (click) {
//Click handler that filters clicks on button/icon vs actual container (.left-drawer)
   let target = $(click.target);
   if ($(target).is(("i.material-icons") || $(target).is(("button"))) === false) {
      $("#app").toggleClass('drawer-open');
   }
});

//Function for popping up the modal form on add-todo button click (Button Clicks)
function closeModal () {
   $("div.modal").removeClass("open")
}
$(".add-todo").on("click", function () {$("div.modal").addClass("open")});
$("button.create-todo").click(closeModal);
$("button.cancel-create-todo").click(function () {
   $("form.todo-form").trigger("reset"); 
   $("div.modal").removeClass("open");
});

$(".todo-form").submit(function (event) {
   event.preventDefault();
});

let properDateString
function createTodoFromForm () {
//My solution for converting GMT/UTC to Central-US time zone & yyyy-mm-dd --> mm-dd-yyyy
   let targetDate = new Date(document.getElementById("todo-due-date").value);
   let dd = (targetDate.getDate() + 1);
   let mm = (targetDate.getMonth() + 1) < 10 ? "0" + (targetDate.getMonth() + 1) : (targetDate.getMonth() + 1); // 0 is January, so we must add 1
   let yyyy = targetDate.getFullYear();
   properDateString = `${mm}-${dd}-${yyyy}`;
   if (editModeTodo != null) {
      let editedTask = {
         title: document.getElementById("todo-title").value,
         dueDate: properDateString,
         description: document.getElementById("todo-description").value,
         isComplete: false,
      }
      return editedTask
   } else {
      let newTask = {
         title: document.getElementById("todo-title").value,
         dueDate: properDateString,
         description: document.getElementById("todo-description").value,
         isComplete: false,
      }
      return newTask
   }
}

function addTaskToArray () {
//Simple, saves returned object freshly baked from form and adds to the front of allTodos[] & repopulates
   let newTask;
   if (editModeTodo != null) {
      newTask = createTodoFromForm();
      allTodos.splice(editModeTodo.id, 1, newTask)
      storeData();
      renderTodos();
      editModeTodo = null;
      $("form.todo-form").trigger("reset")
   } else {
      newTask = createTodoFromForm();
      allTodos.unshift(newTask)
      storeData();
      renderTodos();
      editModeTodo = null;
      $("form.todo-form").trigger("reset")
   }
}
$("button.when-valid").on("click", addTaskToArray);

$('main').on('click', '.action.complete', function () {
   let selectedTask = $(this).closest('.todo')
   let currentTaskData = $(this).closest('.todo').data();
   currentTaskData.todo.isComplete = true;
   selectedTask.slideUp('linear', function () {
   renderTodos();
   });
});

function isCurrent (task) {
   let  dateAmericaCT = new Date(task.dueDate);
   dateAmericaCT.setHours(dateAmericaCT.getHours()+6);
   return dateAmericaCT > new Date();
}

function splitTodos () { 
   pendingTodos = allTodos.filter(task => {
      return (!task.isComplete && isCurrent(task))
   });

   completedTodos = allTodos.filter(task => {
      return (task.isComplete)
   });

   expiredTodos = allTodos.filter(task => {
      return (!task.isComplete && !isCurrent(task))
   });
}

function storeData () {
   localStorage.setItem('allTodos', JSON.stringify(allTodos));
}

function retrieveData () {
   allTodos = JSON.parse(localStorage.getItem('allTodos')) || fetchDefaultTodos();
}

const fetchDefaultTodos = () => {
   let targetDate = new Date();
   let dd = targetDate.getDate() + 1;
   let mm = targetDate.getMonth() + 2; // 0 is January, so I must add 1
   let yyyy = targetDate.getFullYear();
   let dateString = mm + "-" + dd + "-" + yyyy;
   targetDate.setDate(targetDate.getDate() + 1);
   const tutorialTodos = [
      {title: '🎉Welcome to My Todo App!😁',
       dueDate: dateString,
       description: "I'm a Task board!😉 The next 6 will show you around",
       isComplete: false,
      },
      {title: '(☞ﾟヮﾟ)☞ "Title, goes here" ☜(ﾟヮﾟ☜)',
       dueDate: dateString,
       description: '👆 You will set your own Due date, which helps determines where your task end up',
       isComplete: false,
      },
      {title: '🤓We have two main buttons! ',
       dueDate: dateString,
       description: '"Complete" does exactly what it sounds like ¯\_(ツ)_/¯... & the other, "Deletes"',
       isComplete: false,
      },
      {title: "I'm Lonely 😢",
       dueDate: '02-26-21',
       description: "Awww bring this Task a Friend by pressing >Complete< on an Above Task",
       isComplete: true,
      },
      {title: "☠💀☠",
       dueDate: "11-01-1600",
       description: "Oooo.. 👀 Looks like a Task Expired. Don't let 💤 l-a-z-i-n-e-s-s😡 win. Complete your task 👏on👏time!👏",
       isComplete: false,
      },
      {title: "Clone or Create a new Task Buddy ",
       dueDate: "07-07-2077",
       description: "I'm from the year 2077 (⌐■_■), we now have the ability to clone or create all new Task with a push of the create task button on the Left 👈🤯👈",
       isComplete: false,
      },
      {title: "Thank You‼",
       dueDate: "07-06-1990",
       description: 'I appericate you for taking time to check out my web app and hope you have a productive day.🙏🏽 "Success usually comes to those who are too busy to be looking for it. ~Henry David Thoreau"',
       isComplete: true,

      },
   ]
   return tutorialTodos
}

$('main').on('click', '.action.delete', function () {
   let selectedTask = $(this).closest('.todo')
   let nearest = $(this).closest('.todo').data()
   let deletes = allTodos.indexOf(nearest.todo)
   $(selectedTask).animate({
      marginTop: 80,
      marginBottom: 140,
      marginLeft: 120,
      width: '15%',
      height: '8%',
      opacity: '0.2',
   }, 430 , function () {
         allTodos.splice(deletes, 1)
         storeData();
         splitTodos();
         renderTodos();
         });
})

$('#app').on('click', '.action.remove-completed', function () {
   $(".completed-todos > .todo").animate({
      marginTop: 80,
      marginBottom: 140,
   });
   $(".completed-todos > .todo").slideUp('linear', function (){
      function removeCompleted () {
         allTodos = allTodos.filter(task => task.isComplete === false)
         return allTodos
      }
      removeCompleted(); storeData(); splitTodos(); renderTodos();
   });
});

$('#app').on('click', '.action.remove-expired', function () {
   $(".expired-todos > .todo").animate({
      scale: (1.5),
      width: '25%',
      height: '8%',
      opacity: '0.2',
      marginTop: 80,
      marginBottom: 140,
      marginLeft: 120,
   });
   $(".expired-todos > .todo").slideUp('linear', function () {
      function removeExpired () {
         allTodos = allTodos.filter(task => {
            return isCurrent(task) && !task.isComplete || task.isComplete
         });
      }
      removeExpired(); storeData(); splitTodos(); renderTodos();
   });
});

let editModeTodo = null;
$('main').on('click', 'button.edit', function editButton () {
   let currentTaskData = $(this).closest('.todo').data();
   editModeTodo = currentTaskData.todo
   let targetDate  = new Date(editModeTodo.dueDate);
   let dd = (targetDate.getDate() < 10 ? "0" + targetDate.getDate() : targetDate.getDate());
   let mm = (targetDate.getMonth() + 1) < 10 ? "0" + (targetDate.getMonth() + 1) : (targetDate.getMonth() + 1); // 0 is January, so we must add 1
   let yyyy = targetDate.getFullYear();
   let dateString = `${yyyy}-${mm}-${dd}`;

   document.getElementById("todo-title").value += editModeTodo.title;
   document.getElementById("todo-due-date").value += dateString;
   document.getElementById("todo-description").value +=  editModeTodo.description;

   $("div.modal").addClass("open")
   return editModeTodo
})

$('.videoControl').on('click', function() {
   var icon = $('.volume_status');
   icon.toggleClass('off');
   if ( icon.hasClass('off') ) {
     icon.text('volume_off');
     $('.videoControl span').html('Volume Off')
   } else {
     $('.videoControl span').html('Volume On')
     icon.text('volume_up');
   }
 });

let video = document.getElementById("bg-video");
$('.videoControl').on('click', function mutes () {
   video.muted === true ? video.muted= false : video.muted= true;
});

window.SetVolume = function(val) {
   video.muted= false
   var player = document.getElementById('bg-video');
   player.volume = val / 100;
}

retrieveData(); 
splitTodos(); 
renderTodos();