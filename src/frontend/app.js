document.addEventListener("DOMContentLoaded", async () => {
    
    // Handle navigation:
    function navigate(viewId) {
      // Hide all views
      document.querySelectorAll(".view").forEach((view) => {
        view.style.display = "none";
      });
  
      // Show the requested view
      document.getElementById(viewId).style.display = "block";

      localStorage.setItem('currentView', viewId); // sets current view
    }
  
    // Views: 
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

    // login-view buttons:
    document
      .getElementById("switch-login")
      .addEventListener("click", () => navigateLoginViews("login-container"));

    document
      .getElementById("switch-signup")
      .addEventListener("click", () => navigateLoginViews("signup-container"));

    // Function for login page views specifically
    function navigateLoginViews(viewId){
      // Hide all views
      console.log("navigated to " + viewId)
      document.querySelectorAll(".login-container").forEach((view) => {
        view.style.display = "none";
      });
  
      // Show the requested view
      document.getElementById(viewId).style.display = "block";
    }

    // default at login view:
    navigateLoginViews("login-container");

    // confirming logout
    function confirmLogout(){
      const userConfirmed = confirm("Do you want to logout?");
    
      if (userConfirmed) {
          logoutUser();
      } 
    }
    // Initialize with the current view or home view as default
    const lastView = localStorage.getItem('currentView') || 'homeView';
    navigate(lastView);

    // Menu button and sidebar function:
    let menuBtn = document.querySelector('#menu');
    let sidebar = document.querySelector('.sidebar');

    menuBtn.onclick = function() {
        sidebar.classList.toggle('active');
        console.log("menu clicked")
    };

    // ----------------------------------- LOGIN HANDLING ----------------------------------- \\
    
    // TODO: remove fake sample data for frontend purposes:
    function fetchUserDatabase(){
      return {
        "keshran" : "k3",
        "nhford" : "nosir",
        "hackherenthusiast123" : "t3F#wwdg34gt3wg23@$Q72f0r5ur3#@$Q@#$!FDS@#5R@",
      }
    }

    // TODO: (requires database for authentication?)
    function authenticateUser(username, password){
      let correctLogin = false;
      const userDatabase = fetchUserDatabase()
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
      callAllProfileFunctions(); // Calls profile functions
      alert('Login successful!');
      navigate("homeView"); // Redirects user to home page
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
    
    }

    // log out user
    function logoutUser() {
      // Remove the username from local storage
      localStorage.removeItem('username');
            
      console.log('User logged out');
      // Perform additional logout logic here (e.g., redirect to login page)
      navigate("loginView");
    }

    // LOGIN BUTTON FUNCTION:
    
    const loginSubmitButton = document.getElementById("submit-login");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    loginSubmitButton.addEventListener('click', () => {
      authenticateUser(usernameInput.value, passwordInput.value);
    });

    // SIGNUP BUTTON FUNCTION:

    const signupSubmitButton = document.getElementById("submit-signup");
    const signupUsernameInput = document.getElementById("signup-username");
    const signupPasswordInput = document.getElementById("signup-password");

    signupSubmitButton.addEventListener('click', () => {
      // sign up user:
      authenticateSignup(signupUsernameInput.value, signupPasswordInput.value);
    });

    function authenticateSignup(username, password){
      const userDatabase = fetchUserDatabase()
      if (Object.keys(userDatabase).some(e => e === username)){
        // return an alert saying the username exists:
        alert('That username already exists');
      } else if(username.length < 1 || password.length < 1) { 
        alert('Please enter a valid username/password');
      } else if(username === password) {
        alert('Your username can not be identical to your password');
      } else {
        signupUser(username, password); // function to sign the user up
      }
    }

    function signupUser(username, password) {
      // TODO: adds the user to the database
      console.log("user " + username + " has been signed up!");
    }

    // ----------------------------------- PROFILE FUNCTIONS ----------------------------------- \\

    // function to call all the profile functions
    function callAllProfileFunctions(){
      let username = getUsername();

      if (username === null){
        return; // returns if not logged in
      }

      updateNameTag(username);
    }

    callAllProfileFunctions(); // Call on load-in

    function updateNameTag(username) {
      const nameTag = document.getElementById('name-tag');
      nameTag.textContent = `Welcome, ${username}!`;
      console.log("name updated")
    }

    // ----------------------------------- FOOD TABLE AND SEARCH ----------------------------------- \\
    
    // ---- POPUP CONTAINER ---- \\

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

        // Update table:
        populateTable(foodData);
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

      // view reviews button
      const viewReviewsButton = document.createElement('button');
      viewReviewsButton.classList.add('view-reviews-button');
      viewReviewsButton.textContent = 'View Reviews';

      // close popup
      viewReviewsButton.addEventListener('click', () => {
        popupContainer.remove(); // Remove the popup when close button is clicked
        showReviewsPopup(foodItem); // Opens reviews
      });
      
      popupContent.appendChild(closeButton);
      popupContent.appendChild(leaveReviewButton);
      popupContent.appendChild(viewReviewsButton);
      popupContainer.appendChild(popupContent);
      
      document.body.appendChild(popupContainer); // Append the popup to the body or a container
    }  

    //--END OF POPUP CONTAINER--\\
    
    //---SHOW REVIEWS---\\
    async function showReviewsPopup(foodItem) {
      const reviewsContainer = document.createElement('div');
      reviewsContainer.classList.add('popup-container');
  
      // Create content for the popup
      const reviewsContent = document.createElement('div');
      reviewsContent.classList.add('popup-content');
      
      reviewsContent.innerHTML = `
          <h2>${foodItem.name} Reviews</h2>
      `;

      let foodItems = await loadFoodData();
      // Check if the food item has reviews
      if (foodItems[foodItem.name] && foodItems[foodItem.name].reviews.length > 0) {
        // Iterate through the reviews and create <p> elements for each
        foodItems[foodItem.name].reviews.forEach(review => {
            const reviewText = `${review.rating}/5.0: ${review.text}`;
            const reviewElement = document.createElement('p');
            reviewElement.textContent = reviewText;
            reviewsContent.appendChild(reviewElement);
        });
      } else {
        // If no reviews, create a <p> element with the 'No reviews available' text and append it
        const noReviewsElement = document.createElement('p');
        noReviewsElement.textContent = 'No reviews available.';
        reviewsContent.appendChild(noReviewsElement);
      }

      const closeReviewsButton = document.createElement('button');
      closeReviewsButton.textContent = 'Close Reviews';

      closeReviewsButton.addEventListener('click', () => {
        reviewsContainer.remove(); // Remove the reviews container
        showFoodDetailsPopup(foodItem); // Re-open the og popup
      });

      reviewsContent.appendChild(closeReviewsButton);
      reviewsContainer.appendChild(reviewsContent);

      document.body.appendChild(reviewsContainer);
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

    // function for populating table and searching
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

