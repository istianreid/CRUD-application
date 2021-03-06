//local storage
let accounts = [];
var adapter = new LocalStorage('db')
var db = low(adapter)

db.defaults({ accounts: [] }).write();


const accountsForm = document.forms.namedItem("accounts-form");
const addBtn = document.querySelector("#add-button");
const updateBtn = document.querySelector("#update-button");
const cancelBtn = document.querySelector("#cancel-button");
const accountContainer = document.querySelector("#account-card-container");
const accountCard = document.querySelector("#card");

// inputs
let accountIdInput = "" ;
let accountNameInput = "";
let emailAddInput = "";
let userNameInput = "";
let passwordInput = "";

// flag to know which action to do, add or edit
let formAction = "add";


accountsForm.addEventListener("change", function() {
    accountIdInput = document.querySelector('input[name="Id"]').value.trim();
    accountNameInput = document.querySelector('input[name="name-of-account"]').value.trim();
    emailAddInput = document.querySelector('input[name="email"]').value.trim();
    userNameInput = document.querySelector('input[name="username"]').value.trim();
    passwordInput = document.querySelector('input[name="password"]').value.trim();
});

//add account
const addAccount = (account) => {
    // create a template form a table row
    const card = 

        ` <div class="account-card shadow col-xl-2 col-lg-4 col-sm-12"  data="${account.accountId}">
              <p class="id">${account.accountId}</p>
              <p class="account-name">${account.accountName}</p>
              <p class="email">${account.emailAdd}</p>
              <p class="username">${account.userName}</p>
              <p class="password">${account.password}</p>
              <div id="update-account-buttons">
                  <input id="edit-button" type="submit" class="edit card-btn "  value="edit">
                  <input id="delete-button" type="button" class="delete card-btn-red " value="delete">
              </div>
          </div>`

    // store the array in the local storage

    db.get("accounts").push(account).write();

    // concatenate new row to the table
    accountContainer.innerHTML += card;

    // clear form inputs
    accountsForm.reset();

    console.log(account)

}


// prevent form submission
accountsForm.addEventListener("submit", (event) => {
    event.preventDefault();
});


// cancel Account update
cancelBtn.addEventListener("click", function () {
    // set form flag to add mode
    formAction = "add";
  
    // clear form inputs
    accountsForm.reset();
  
    // enable isbn input field
    document.querySelector('input[name="Id"]').readOnly = false;
  
    // hide and show button groups
    document.querySelector("#add-account-buttons").classList.remove("d-none");
    document.querySelector("#update-account-buttons").classList.add("d-none");
});


// add new account
addBtn.addEventListener("click", function () {
    // check if form action set to add mode
    if (formAction == "add") {
      // check if all inputs were not empty
      if (accountIdInput && accountNameInput && emailAddInput && userNameInput && passwordInput) {
        // prepare the account object
        let account = {
            accountId: accountIdInput ,
            accountName: accountNameInput,
            emailAdd: emailAddInput,
            userName: userNameInput,
            password: passwordInput,
        };

        let findAccount = db.get("accounts").find({accountId : accountIdInput}).value();
        console.log(`####3${findAccount}`);


        
        if (findAccount) {
          // show error alert
          alert("Account already exist!");
          return 0;
        }
        
        // add new account object to array
        
        console.log(`#######${accountIdInput}`)
        addAccount(account);
        
        
        // show add alert
        alert("Account has been added!");
      } else {
        // show error alert
        alert("All input should not be empty!");
      }
    }
});

// update the existing Account info

updateBtn.addEventListener("click", function () {

    // select form inputs
    
    let accountIdInput = document.querySelector('input[name="Id"]').value.trim();
    let accountNameInput = document.querySelector('input[name="name-of-account"]').value.trim();
    let emailAddInput = document.querySelector('input[name="email"]').value.trim();
    let userNameInput = document.querySelector('input[name="username"]').value.trim();
    let passwordInput = document.querySelector('input[name="password"]').value.trim();
  
    // check if form action set to edit mode
    if (formAction == "edit") {
      // select table row to be edited
      const box = document.querySelector(
        `#account-card-container .account-card[data="${accountIdInput}"]`
      );

      // overwrite table row data values
      box.children[1].innerText = accountNameInput;
      box.children[2].innerText = emailAddInput;
      box.children[3].innerText = userNameInput;
      box.children[4].innerText = passwordInput;

      db.get('accounts')
        .find({ accountId: accountIdInput } )
        .assign({accountId: accountIdInput, accountName: accountNameInput, emailAdd: emailAddInput, userName: userNameInput, password: passwordInput })
        .write()
  
      // clear form inputs
      accountsForm.reset();
  
      // enable isbn input field
      document.querySelector('input[name="Id"]').readOnly = false;
  
      // hide and show button groups
      document.querySelector("#add-account-buttons").classList.remove("d-none");
      document.querySelector("#update-account-buttons").classList.add("d-none");
  
      // show update alert
      alert("Account has been updated!");

      
    }
});

    // table row action for edit and delete
    accountContainer.addEventListener("click", (e) => {
    // when delete action is clicked 

    if (e.target.className.includes("delete")) {
      // delete flag
      let isDelete = false;
      // show prompt
      const r = confirm("Are you sure?");
      console.log(e);
  
      // set delete confirmation flag
      if (r == true) {
        isDelete = true;
      } else {
        isDelete = false;
      }
  
      // if cancelled, don't continue deletion
      if (!isDelete) return 0;
  
      // remove table row
      e.target.parentNode.parentNode.remove();
  
  
      db.get('accounts')
      .remove({ accountId: e.target.parentNode.parentNode.getAttribute('data')})
      .write()


      alert("Account has been deleted!");
  

    }
  
    // when edit action is clicked
    if (e.target.className.includes("edit")) {
      // set form flag to edit mode
      formAction = "edit";
  
      // disable isbn input field
      document.querySelector('input[name="Id"]').readOnly = true;
  
      // hide and show button groups
      document.querySelector("#add-account-buttons").classList.add("d-none");
      document.querySelector("#update-account-buttons").classList.remove("d-none");
  
      // select table row childrens
      const tds = e.target.parentNode.parentNode.children;
  
      // put existing account info to be edited in the form

      document.querySelector('input[name="Id"]').value = Array.from(tds)[0].innerText;
      document.querySelector('input[name="name-of-account"]').value = Array.from(tds)[1].innerText;
      document.querySelector('input[name="email"]').value = Array.from(tds)[2].innerText;
      document.querySelector('input[name="username"]').value = Array.from(tds)[3].innerText;
      document.querySelector('input[name="password"]').value = Array.from(tds)[4].innerText;

      
    }
  });

  
function my_code() {
    const Accounts = db.get("accounts").value();
        Accounts.forEach((account) => {

                const card = 

                `<div class="account-card shadow col-xl-2 col-lg-4 col-sm-12" data="${account.accountId}">
                    
                    <p class="id">${account.accountId}</p>
                    <p class="account-name">${account.accountName}</p>
                    <p class="email">${account.emailAdd}</p>
                    <p class="username">${account.userName}</p>
                    <p class="password">${account.password}</p>
                  <div id="update-account-buttons">
                      <input id="edit-button" type="submit"  class="edit card-btn "  value="edit">
                      <input id="delete-button" type="button"   class="delete card-btn-red" value="delete">
                  </div>
                </div>`

            accountContainer.innerHTML += card;

        });
}
window.onload = my_code();




