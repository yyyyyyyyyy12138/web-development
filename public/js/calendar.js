
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class Calendar {
    constructor(date, user) {
        this.date = date;
        this.user = user;
    }

    createCalendar = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
        this.date.setDate(1);
        const currlastDay = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
        const prevLastDay = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        const fstDayIdx = this.date.getDay();
        const lastDayIdx = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    
        // Set up the calendar month display
        document.querySelector(".date h1").innerHTML = months[this.date.getMonth()]
        document.querySelector(".date p").innerHTML = "Today: " + new Date().toDateString();
    
        // Set up the calendar day display
        let days = "";
        for (let i=fstDayIdx; i>0; i--) {
            const thisDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1, prevLastDay - i + 1);
            const dateStr = thisDate.toISOString();
            days += `<div class="prev-date" data-date="${dateStr}">${prevLastDay-i+1}</div>`;
        }
        for (let i=1; i<=currlastDay; i++) {
            const thisDate = new Date(this.date.getFullYear(), this.date.getMonth(), i);
            const dateStr = thisDate.toISOString();
            if (i == new Date().getDate() && this.date.getMonth() === new Date().getMonth()) {
                days += `<div class="current-date" data-date="${dateStr}">${i}</div>`;
            } else {
                days += `<div data-date="${dateStr}">${i}</div>`;
            }
        }
        for(let i=1; i<7-lastDayIdx; i++) {
            const thisDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, i);
            const dateStr = thisDate.toISOString();
            days += `<div class="next-date" data-date="${dateStr}">${i}</div>`;
        }
        document.querySelector('.days').innerHTML = days;
        
        // Add event listeners to calendar day elements
        let previousDayElement = null;
        const calendarDayElements = document.querySelectorAll('.days div');
        calendarDayElements.forEach((dayElement) => {
            dayElement.addEventListener('click', () => {
              let selectedDate = new Date(dayElement.getAttribute('data-date'));
              selectedDate = selectedDate.toDateString();
              console.log("Clicked on date", selectedDate);
              //TODO: click on and then don't move the border
              this.loadRecordsForDate(selectedDate);

              if (previousDayElement && !previousDayElement.classList.contains('current-date')) {
                previousDayElement.style.backgroundColor = '';
              }
              if (!dayElement.classList.contains('current-date')) {
                dayElement.style.backgroundColor = 'rgb(56, 63, 58)';
                }
                previousDayElement = dayElement;
            });
          });
    
    }

    loadRecordsForDate = async (selectedDate) => {
        let currentDate = new Date();
        currentDate = currentDate.toDateString();
        if (selectedDate === currentDate) {
            document.querySelector('#summary h2').textContent = `Summary for Today`;
        } else {
            document.querySelector('#summary h2').textContent = `Summary for ${selectedDate}`;
        }
        // document.querySelector('#sidebar h2').textContenet = `Choose the date: ${selectedDate}`;
        let records = await this.user.getRecords(selectedDate);
        if (records !== undefined) {
            let totalCalories = records["calories"];
            let weight = records["weight"];
            let foodList = records["foodList"];
          
            document.getElementById("foodList").innerHTML = foodList.map(food => `<li>${food}</li>`).join("");
            document.getElementById("caloriesTotal").textContent = `Total Calories: ${totalCalories} calories`;
            document.getElementById("todayWeight").textContent = `Weight: ${weight} lbs`;
            console.log("Records loaded for", selectedDate);
          } else {
            // Handle the case when records is undefined
            // For example, display a message or handle the error condition
            console.log("No records found for", selectedDate);
            document.getElementById("foodList").innerHTML = "";
            document.getElementById("caloriesTotal").textContent = "Total Calories: 0 calories";
            document.getElementById("todayWeight").textContent = "Weight: 0 calories";
          }
    }
}