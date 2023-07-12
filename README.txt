CS193X Final Project
====================

Project Title: FitTrace
Your Name: Rachel Yu
Your SUNetID: 

Overview
--------
A diet and weight tracking app: after logging in, users can record their daily diet with the name of the food and the calories, then they can record their daily weight as well. 
The app generates a summary for each day. Users can check and record every single day by choosing the date on the calendar.

Running
-------
Do we need to load data from init_db.mongodb? Yes.

Running instruction: 
1. Run the MongoDB server with the command 'mongod --dbpath PATH_TO_YOUR_DB_DIRECTORY', keep this window open while the server is running.
2. cd to the project folder, run 'init_db.mongodb'
3. 'npm install' and 'npm start'

Features
--------
<TODO: This doesn't have to be a comprehensive list. But if there's anything we should definitely try or might miss, this is a good place to let us know about that.>
1. Login will create a new user if the user id is not found (similar logic as assign 3)
2. When users login, the web page will show the records for today's date directly (if database has this date's records)
3. When clicking on today's date, the web page shows "Summary for Today", while clicking on other dates, it changes to the real date format.
3. Calendar features: 
    The two arrows on each side of month display are to switch the calendar days to previous or next month; 
    The dates which belong to previous month and next month are half transparent, showing lighter grey in the calendar; 
    The current date is showing below the month display, and also highlighted as green background in days section; 
    When the cursor hovers to any of days other than today, the background of that date changes to dark grey, and when users click on them, the grey background stays on the just clicked date until user continues to click on other dates.
4. Users can save or update the summary for any date only when they click on "SAVE" button, which will trigger the app to save the record to the database. If users only add
items to food list and record their weight, without clicking the "SAVE" button, the database won't be updated.

5. Users can update the name, age, gender in users' profile (only when clicking on the check button right after specific item, that specific item will be updated)
6. If change profile's name to empty, it will automatically save user ID as its name and show the user ID in name input field directly.
6. Handling some error checkings, such as clicking "add" button when there is empty inputs in food input or calories input sections.
8. Users are allowed to save summary with all-zeros inputs or unchanged records for any dates (User won't see the difference and console log anyway, and it won't affect the database operations)
9. "Clear list" button only clear the food list and total calories calculated, it won't save or update the summary if users don't click on "SAVE" button.

Collaboration and libraries
---------------------------
Using the part of code from assign3.2

Anything else?
-------------
Course is awesome!!
