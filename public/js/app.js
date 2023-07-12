import User from "./user.js";
import Calendar from "./calendar.js";

let date = new Date();
export default class App {
    constructor() {
        this._user = null;
        this._calendar = null;

        this._loginForm = document.querySelector("#loginForm");
        this._loginForm.listUsers.addEventListener("click", this._onListUsers.bind(this));

        this._loginForm.addEventListener("submit", this._onLoginFormSubmit.bind(this));

        document.getElementById("addFoodBtn").addEventListener("click", this._handleAddFood.bind(this));
        document.getElementById("recordWeightBtn").addEventListener("click", this._handleAddWeight.bind(this));

        this._nameForm = document.querySelector("#nameForm");
        this._nameForm.addEventListener("submit", this._onUpdateName.bind(this));
        this._ageForm = document.querySelector("#ageForm");
        this._ageForm.addEventListener("submit", this._onUpdateAge.bind(this));
        this._genderForm = document.querySelector("#genderForm");
        this._genderForm.addEventListener("submit", this._onUpdateGender.bind(this));
        
        document.getElementById("saveBtn").addEventListener("click", this._onSave.bind(this));

        document.getElementById("clearBtn").addEventListener("click", () => {
          // Clear the food list and total calories
          document.getElementById("foodList").innerHTML = "";
          document.getElementById("caloriesTotal").textContent = "Total Calories: 0 calories";
        });

        // Calendar set up, set up the switch arrow
        document.querySelector(".prev").addEventListener("click", () => {
            date.setMonth(date.getMonth() - 1);
            this._calendar.createCalendar(date, this._user);
        })

        document.querySelector(".next").addEventListener("click", () => {
            date.setMonth(date.getMonth() + 1);
            this._calendar.createCalendar(date, this._user);
        })
    }

    /*** Event handlers ***/

    async _onListUsers() {
        let users = await User.listUsers();
        let usersStr = users.join("\n");
        alert(`List of users:\n\n${usersStr}`);
    }

    async _onLoginFormSubmit(event) {
        event.preventDefault();
        let userId = this._loginForm.userid.value;
        try {
          this._user = await User.loadOrCreate(userId);
          console.log(this._user);
          this._loadProfile();
          this._loginForm.reset();
          // New calendar
          this._calendar = new Calendar(date, this._user);
          this._calendar.createCalendar(date, this._user);
          let currentDate = new Date();
          this._calendar.loadRecordsForDate(currentDate.toDateString());
        } catch (e) {
          alert (e.message);
        }
    }

    async _onUpdateName(event) {
        event.preventDefault();
        let displayName = this._nameForm.querySelector("#nameInput").value;
        this._user.name = displayName;
        try {
          await this._user.save();
          this._loadProfile();
          alert("Name updated successfully!");
        } catch (e) {
          alert(`Failed to update the name: ${e.message}`);
        }
        if (!displayName) {
          this._nameForm.querySelector("#nameInput").value = this._user.id;
        }
    }

    async _onUpdateAge(event) {
        event.preventDefault();
        let age = this._ageForm.querySelector("#ageInput").value;
        this._user.age = age;
        try {
          await this._user.save();
          this._loadProfile();
          alert("Age updated successfully!");
        } catch (e) {
          alert(`Failed to update the age: ${e.message}`);
        }
    }

    async _onUpdateGender(event) {
        event.preventDefault();
        let gender = this._genderForm.querySelector("#genderInput").value;
        this._user.gender = gender;
        try {
          await this._user.save();
          this._loadProfile();
          alert("Gender updated successfully!");
        } catch (e) {
          alert(`Failed to update the gender: ${e.message}`);
        }
    }



    /* Load (or reload) a user's profile. Assumes that this._user has been set to a User instance. */
    async _loadProfile() {
        document.querySelector("#welcome").classList.add("hidden");
        document.querySelector("#main").classList.remove("hidden");
        document.querySelector("#idContainer").textContent = this._user.id;

        this._nameForm.querySelector("#nameInput").value = this._user.name;
        this._ageForm.querySelector("#ageInput").value = this._user.age;
        this._genderForm.querySelector("#genderInput").value = this._user.gender;
    }


    /* Add food and calories */
    _handleAddFood() {
        let food = document.getElementById("foodInput").value;
        let calories = parseInt(document.getElementById("caloriesInput").value);
        let foodList = document.getElementById("foodList");
        let totalCaloriesElement = document.getElementById("caloriesTotal");
  
        if (!food && isNaN(calories)) {
          alert("Please enter the food and its calories.");
          return;
        }
        if (isNaN(calories)) {
          alert("Please enter a valid number for calories.");
          return;
        }
        if (!food) {
          alert("Please enter the food.");
          return;
        }
        // Add food item to list
        let listItem = document.createElement("li");
        listItem.textContent = `${food} - ${calories} calories`;
        foodList.appendChild(listItem);
        let totalCalories = this.calculateTotalCalories();
        totalCaloriesElement.textContent = `Total Calories: ${totalCalories} calories`;

        document.getElementById("foodInput").value = "";
        document.getElementById("caloriesInput").value = "";  
    }

    calculateTotalCalories() {
        let totalCalories = 0;
        let foodList = document.getElementById("foodList");
        let foodItems = foodList.getElementsByTagName("li");
        for (let i = 0; i < foodItems.length; i++) {
            const calories = parseInt(foodItems[i].textContent.split(" - ")[1]);
            totalCalories += calories;
          }
          return totalCalories;
    }

    _handleAddWeight() {
        let weight = parseFloat(document.getElementById("weightInput").value);
        if (isNaN(weight)) {
          alert("Please enter your weight.");
          return;
        }
        let todayWeightElement = document.getElementById("todayWeight");
        todayWeightElement.textContent = `Weight: ${weight} lbs`;
        document.getElementById("weightInput").value = "";
    }


    async _onSave(event) {
        event.preventDefault();

        let totalCalories = parseInt(document.getElementById("caloriesTotal").textContent.split(":")[1]);
        let todayWeight = parseFloat(document.getElementById("todayWeight").textContent.split(":")[1]);

        let foodListItems = Array.from(document.querySelectorAll("#foodList li"));
        let foodList = foodListItems.map(item => item.textContent);


        let selectedDate = document.querySelector("#summary h2").textContent.split(" ").pop();

        if (selectedDate === "Today") {
            let currentDate = new Date();
            selectedDate = currentDate.toDateString();
        } else {
            selectedDate = document.querySelector("#summary h2").textContent.replace("Summary for ", "");
        }
        console.log("Saving the summary for", selectedDate);

        this._user.records = {
            ...this._user.records,
            [selectedDate]: {
              calories: totalCalories,
              weight: todayWeight,
              foodList: foodList,
            }
        };

        try {
            await this._user.save();
            alert(`Summary saved successfully for ${selectedDate} !`);
        } catch (e) {
          alert(`Failed to save the records: ${e.message}`);
        }
    }

}
