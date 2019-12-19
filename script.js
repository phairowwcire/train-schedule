// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCgNQP_MwicES3KW9Rt-Xey7K4CToxIxvU",
    authDomain: "trainschedule-bc0fb.firebaseapp.com",
    databaseURL: "https://trainschedule-bc0fb.firebaseio.com",
    projectId: "trainschedule-bc0fb",
    storageBucket: "trainschedule-bc0fb.appspot.com",
    messagingSenderId: "829111767339",
    appId: "1:829111767339:web:af8af95f79f644feecb56e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

  // Connects to DataBase
  var database = firebase.database();
  
   
  
  // 2. Button for adding train
  $("#add-train-button").on("click", function(event) {
      //prevents website from refreshing page
    event.preventDefault(); 
  
    // Grabs user input

    //train name is input text box id selector
    var trainName = $("#trainName").val().trim();
    //destination input text box
    var destination = $("#destination").val().trim();
    //first train time input text box
    //moment() is the current date and time
    //moment converts string to a date object
    //moment().format converts back to a string
    var firstTrainTime = moment( $("#firstTrainTime").val().trim(), "HH:mm"    ).format("X");
    //
    console.log( moment(  $("#firstTrainTime").val().trim(), "HH:mm"     ))
    console.log( moment(  $("#firstTrainTime").val().trim(), "HH:mm"     ).format("X"))

    var frequency = $("#frequency").val().trim();
  
    // Creates local "temporary" object for holding employee data

    //anything with curly bracket is an object
    //object has properties, follows with : after that input values
    var  newTrain= {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);
  
    alert("Train Added Succesfully");
  
    // Clears all of the text-boxes
    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#firstTrainTime-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Reads from firebase from the first record to the last record
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = moment(childSnapshot.val().firstTrainTime,"X").format("hh:mm a");
    var frequency = childSnapshot.val().frequency;
  
  
  
  
     // Assume the following situations.
  
      // (TEST 1)
      // First Train of the Day is 3:00 AM
      // Assume Train comes every 3 minutes.
      // Assume the current time is 3:16 AM....
      // What time would the next train be...? (Use your brain first)
      // It would be 3:18 -- 2 minutes away
  
      // (TEST 2)
      // First Train of the Day is 3:00 AM
      // Assume Train comes every 7 minutes.
      // Assume the current time is 3:16 AM....
      // What time would the next train be...? (Use your brain first)
      // It would be 3:21 -- 5 minutes away
  
  
      // ==========================================================
  
      // Solved Mathematically
      // Test case 1:
      //current mins -start mins = results
      // 16 - 00 = 16

    //results % frequency (firebase) = remainder result
      // 16 % 3 = 1 (Modulus is the remainder)

      //frequency from firebase -   remainder result = mins away
      // 3 - 1 = 2 minutes away
      // 2 + 3:16 = 3:18
  
      // Solved Mathematically
      // Test case 2:
      // 16 - 00 = 16
      // 16 % 7 = 2 (Modulus is the remainder)
      // 7 - 2 = 5 minutes away
      // 5 + 3:16 = 3:21
  
      // Assumptions
      var tFrequency = frequency;  //user input
  
      // Time is 3:30 AM
      var firstTime = firstTrainTime; //user input
  
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);
  
      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      console.log(tRemainder);
  
      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));
  
  
    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);
  
    // Prettify the employee start
    var firstTrainTimePretty = moment.unix(firstTrainTime).format("MM/DD/YYYY");
  
    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment(firstTrainTime, "X"), "months");
    console.log(empMonths);
  
    // Calculate the total billed rate
    var empBilled = empMonths * frequency;
    console.log(empBilled);
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(moment(nextTrain,"X").format("hh:mm a")),
      $("<td>").text(tMinutesTillTrain)
     
    );
  
    // Append the new row to the table
    //no dot or # is tag/element selector
    $("tbody").append(newRow);
  });
  
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016
  
  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
  