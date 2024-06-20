document.addEventListener("DOMContentLoaded", async () => {

    function navigate(viewId) {
      // Hide all views
      document.querySelectorAll(".view").forEach((view) => {
        view.style.display = "none";
      });
  
      // Show the requested view
      document.getElementById(viewId).style.display = "block";
    }
  
    document
      .getElementById("home")
      .addEventListener("click", () => navigate("homeView"));
    document
      .getElementById("profile")
      .addEventListener("click", () => getUsername() === "none" ? alert(`You must be logged in to access your profile`) : navigate("profileView"));
      ;
    document
      .getElementById("about")
      .addEventListener("click", () => navigate("aboutView"));
    document
      .getElementById("login")
      .addEventListener("click", () => getUsername() === "none" ? navigate("loginView") : confirmLogout());
      // ^^ above basically means that the login button is a logout button if logged in, or it takes to the login page

    // confirming logout
    function confirmLogout(){
      const userConfirmed = confirm("Do you want to logout?");
    
      if (userConfirmed) {
          logoutUser()
      } 
    }
    // Initialize with the home view
    navigate("homeView");

    // Menu button and sidebar function:
    let menuBtn = document.querySelector('#menu');
    let sidebar = document.querySelector('.sidebar');

    menuBtn.onclick = function() {
        sidebar.classList.toggle('active');
        console.log("menu clicked")
    };

    // ----------------------------------- LOGIN HANDLING ----------------------------------- \\
    
    // fake sample data for frontend purposes:
    userDatabase = {
      "keshran" : "k3",
      "nhford" : "nosir",
      "hackherenthusiast123" : "t3F#wwdg34gt3wg23@$Q72f0r5ur3#@$Q@#$!FDS@#5R@",
    }

    // TODO: (requires database for authentication?)
    function authenticateUser(username, password){
      let correctLogin = false;
      // fetch username/password database
      if (userDatabase[username] === password){ // filler database
        correctLogin = true;
      }

      // username password pair is correct:
      if (correctLogin){
        loginUser(username);
      }
      else{ // credentials are incorrect or don't exist
        alert(`Your username/password is incorrect`);
      }
    }

    // function that stores the username in local storage after they've successfully logged in
    function loginUser(username) {
      // Store the username in local storage
      localStorage.setItem('username', username);
      console.log(`User ${username} logged in and stored in local storage.`);
    }

    // getter for the username in local storage
    function getUsername() {
      const username = localStorage.getItem('username');
      if (username) {
          console.log(`Retrieved username: ${username}`);
          return username;
      } else {
          console.log('No username found in local storage.');
          return "none";
      }

      // log out user
      function logoutUser() {
        // Remove the username from local storage
        localStorage.removeItem('username');
        
        console.log('User logged out');
        // Perform additional logout logic here (e.g., redirect to login page)
      }
    
    }

    // LOGIN BUTTON FUNCTION:
  

    // ----------------------------------- FOOD TABLE AND SEARCH ----------------------------------- \\
    
    // ---- POPUP ---- \\

    // Popup for food item:
    function showFoodDetailsPopup(foodItem) {
      // Create a popup container
      const popupContainer = document.createElement('div');
      popupContainer.classList.add('popup-container');
  
      // Create content for the popup
      const popupContent = document.createElement('div');
      popupContent.classList.add('popup-content');
      
      popupContent.innerHTML = `
          <h2>${foodItem.name}</h2>
          <p>Rating: ${foodItem.numReviews !== 0 ? (foodItem.totalRatings / foodItem.numReviews).toFixed(1)+'/5.0' : 'N/A'}</p>
          <p>Number of Reviews: ${foodItem.numReviews}</p>
          <p>Calories: ${foodItem.calories}</p>
      `;

      // Function to update food item with review
      function leaveReview(reviewText, rating) {
        // Update food item with new review
        foodItem.reviews.push({ text: reviewText, rating: rating });
        foodItem.totalRatings += rating;
        foodItem.numReviews++;

        // TODO: Should also update the user's reviews object with the review
        // ex. user.reviews.push({ text: reviewText, rating: rating });

        // Update UI with new rating and numReviews
        const newRating = foodItem.numReviews !== 0 ? (foodItem.totalRatings / foodItem.numReviews).toFixed(1) : 'N/A';
        popupContent.querySelector('p:nth-of-type(1)').textContent = `Rating: ${newRating}/5`;
        popupContent.querySelector('p:nth-of-type(2)').textContent = `Number of Reviews: ${foodItem.numReviews}`;

        // TODO: Update JSON or backend with new data
        updateFoodItemInJSON(foodItem);
      }

      // updating food item
      async function updateFoodItemInJSON(foodItem) {
        try {
          // Fetch the existing food list from JSON
          const response = await fetch('food_list.json');
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const foodList = await response.json();
      
          // Find the food item in the JSON data
          foodList[foodItem.name] = foodItem;
            
          // TODO: update the JSON file

        } catch (error) {
          console.error('Error updating food item in JSON:', error);
          // Handle the error as needed (e.g., show error message to user)
        }
      }
      
      
      // Close button for the popup
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', () => {
          popupContainer.remove(); // Remove the popup when close button is clicked
      });

      const leaveReviewButton = document.createElement('button');
      leaveReviewButton.classList.add('leave-review-button');
      leaveReviewButton.textContent = 'Leave Review';
      leaveReviewButton.addEventListener('click', () => {
        // Hide Leave Review button
        leaveReviewButton.style.display = 'none';
      
        // Create rating dropdown and review input
        const ratingSelect = document.createElement('select');
        ratingSelect.id = 'rating-select';
        ratingSelect.classList.add('rating-select');
        ratingSelect.innerHTML = `
          <option value="NaN">N/A</option>
          <option value="0">0</option>
          <option value="0.5">0.5</option>
          <option value="1">1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="2.5">2.5</option>
          <option value="3">3</option>
          <option value="3.5">3.5</option>
          <option value="4">4</option>
          <option value="4.5">4.5</option>
          <option value="5">5</option>
        `;
      
        const reviewInput = document.createElement('textarea');
        reviewInput.placeholder = 'Write your review here...';
        reviewInput.style.width = '100%';
        reviewInput.style.height = '100px';
        reviewInput.classList.add('reviewInput');
      
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Review';
        submitButton.classList.add('submit-review');
        submitButton.addEventListener('click', () => {
          const selectedRating = parseFloat(ratingSelect.value);
          const reviewText = reviewInput.value.trim();
          if (isNaN(selectedRating) || selectedRating < 0 || selectedRating > 5) {
            alert('Please select a valid rating between 0 and 5.');
            return;
          }
          if (reviewText === '') {
            alert('Please enter a review text.');
            return;
          }
          leaveReview(reviewText, selectedRating);
          // Remove review items after submitting
          submitButton.remove();
          reviewInput.remove();
          ratingSelect.remove();
        });
      
        popupContent.appendChild(ratingSelect);
        popupContent.appendChild(reviewInput);
        popupContent.appendChild(submitButton);
      });
      
    
      
      popupContent.appendChild(closeButton);
      popupContent.appendChild(leaveReviewButton);
      popupContainer.appendChild(popupContent);
      
      document.body.appendChild(popupContainer); // Append the popup to the body or a container
    }    

    // ---- LOADING FOOD DATA ---- \\
    let foodValues = {};
    try {
      const foodList = await loadFoodData();
      //console.log(foodList);

      foodValues = Object.values(foodList);

    } catch (error) {
        console.error('Error loading food data:', error);
    }

    let foodData = foodValues;

    if (foodData === null){
      foodData = [ // example data only for failure
        { name: 'Yucca Fries', totalRatings: 175, numReviews: 46 },
        { name: 'Salt & Pepper Tofu', totalRatings: 270, numReviews: 54 },
        { name: 'Kelp Burger', totalRatings: 22, numReviews: 17 }
      ];
    }

    // ---- DYNAMIC SEARCH BAR ---- \\

    // Dynamically update search from search bar
    
    const searchBar = document.getElementById('foodSearch');

    let filteredFoodData = foodData;

    populateTable(filteredFoodData);

    searchBar.addEventListener('keyup', (e) => {
      const searchString = e.target.value.toLowerCase();

      filteredFoodData = foodData.filter(item =>
          item.name.toLowerCase().includes(searchString)
      );

      populateTable(filteredFoodData);
    });

    // TODO: filter foodData item by search

    function populateTable(filteredFoodData) {
      const tableBody = document.querySelector('#data-table tbody');
      tableBody.innerHTML = '';

      filteredFoodData.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('foodRow'); // Add a class to the <tr> element
        row.id = item.name; // Set the id attribute


        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const ratingCell = document.createElement('td');
        ratingCell.textContent = round(item.totalRatings/item.numReviews,1);
        if (ratingCell.textContent === "NaN"){
          ratingCell.textContent = "N/A";
        }
        row.appendChild(ratingCell);

        const numReviewsCell = document.createElement('td');
        numReviewsCell.textContent = item.numReviews;
        row.appendChild(numReviewsCell);

        tableBody.appendChild(row);

        row.addEventListener("click", function () {
          showFoodDetailsPopup(item); // Call function to show popup with food item details
          // TODO: brings up information for food item
          //console.log("clicked " + row.id);
        });
    });
    }

    

    // ------------------------------ End Food Table and Search: ------------------------------ \\

  });


// Used for rounding calculations
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


async function loadFoodData() {
  try {
      const response = await fetch('food_list.json');

      if (!response.ok) {
          throw new Error('Network response was not ok. ' + response.statusText);
      }

      const foodList = await response.json();
      return foodList; // Return the parsed JSON object
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      throw error; // Rethrow the error for further handling
  }
}

