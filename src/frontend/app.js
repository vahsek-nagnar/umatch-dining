// DOM CONTENT LOADED:
document.addEventListener("DOMContentLoaded", async () => {
    
    // Handle navigation:
    function navigate(viewId) {

      // default view to home if something random
      if (![ 'homeView', 'profileView', 'aboutView', 'loginView' ].includes(viewId)) {
        viewId = 'homeView';
      }
    
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
    document
      .getElementById("about")
      .addEventListener("click", () => navigate("aboutView"));
    document
      .getElementById("login")
      .addEventListener("click", () => getUsername() === "none" ? navigate("loginView") : confirmLogout());
      // ^^ above basically means that the login button is a logout button if logged in, or it takes to the login page

    document
      .getElementById("profile")
      .addEventListener("click", () => callAllProfileFunctions());

      
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
    
    // Function to fetch the user database
    async function fetchUserDatabase() {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch user database');
        }
        const users = await response.json();
    
        const userDatabase = {};
        users.forEach(user => {
          userDatabase[user._id] = user;
        });
    
        return userDatabase;
      } catch (error) {
        console.error('Error fetching user database:', error);
        throw error;
      }
    }
      

    // Authenticate user function
    async function authenticateUser(username, password) {
      try {
        const userDatabase = await fetchUserDatabase(); // Wait for the database to be fetched
        console.log(userDatabase);
    
        if (userDatabase[username]) {
          const hashedPassword = await hashPassword(password); // Hash the entered password
          if (userDatabase[username].password === hashedPassword) {
              loginUser(username);
          } else {
              alert('Your username/password is incorrect');
          }
      } else {
          alert('Your username/password is incorrect');
      }
      } catch (error) {
        console.error('Error during authentication:', error);
        alert('An error occurred during authentication');
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

      navigate("loginView");
    }

    // LOGIN BUTTON FUNCTION:
    
    const loginSubmitButton = document.getElementById("submit-login");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    loginSubmitButton.addEventListener('click', () => {
      authenticateUser(usernameInput.value, passwordInput.value);
      usernameInput.value = '';
      passwordInput.value = '';
    });

    // SIGNUP BUTTON FUNCTION:

    const signupSubmitButton = document.getElementById("submit-signup");
    const signupUsernameInput = document.getElementById("signup-username");
    const signupPasswordInput = document.getElementById("signup-password");

    signupSubmitButton.addEventListener('click', () => {
      // sign up user:
      authenticateSignup(signupUsernameInput.value, signupPasswordInput.value);
      signupUsernameInput.value = '';
      signupPasswordInput.value = '';
    });

    // function to authenticate the signup
    function authenticateSignup(username, password){
      const userDatabase = fetchUserDatabase();
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

    // Updated signup user function using fetch API
    async function signupUser(username, password) {
      try {
        // Check if the username already exists
        const response = await fetch(`http://localhost:3000/api/users/${username}`);
        if (response.ok) {
          const existingUser = await response.json();
          if (existingUser) {
            alert('That username already exists');
            return;
          }
        } else if (response.status !== 404) {
          console.log('user is new');
        }

        const hashedPassword = hashPassword(password); // Hash password for safety

        // Create a new user object
        const newUser = {
          _id: username,
          username: username,
          password: hashedPassword,
          reviews: []
        };

        // POST request to create a new user
        const createUserResponse = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });

        if (!createUserResponse.ok) {
          throw new Error('Failed to signup user');
        }

        alert(`User ${username} has been signed up!`);
        navigateLoginViews("login-container");
      } catch (error) {
        console.error('Error signing up user:', error);
      }
    }


    // ----------------------------------- PROFILE FUNCTIONS ----------------------------------- \\

    // function to call all the profile functions
    function callAllProfileFunctions(){
      let username = getUsername();

      if (username === null){
        return; // returns if not logged in
      }

      updateProfile(username);

      displayProfiles('user-info'); // Default to user-info
    }

    callAllProfileFunctions(); // Call on load-in

    // Update profile function
    async function updateProfile(username) {
      const nameTag = document.getElementById('name-tag');
      nameTag.textContent = `User: ${username}`;
      
      // User Info Content:
      const usernameInfo = document.getElementById('username-info');
      const numReviewsInfo = document.getElementById('numReviews-info');
      const avgRatingInfo = document.getElementById('avgRating-info');

      usernameInfo.textContent = `Username: ${username}`;
      
      try {
        // Fetch user data from Express server
        const response = await fetch(`http://localhost:3000/api/users/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const user = await response.json(); // Get user data from server

        // Calculate the number of reviews and average rating
        const numReviews = user.reviews.length;
        const totalRatings = user.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = numReviews > 0 ? (totalRatings / numReviews).toFixed(1) : 'N/A';

        // Update the profile information
        numReviewsInfo.textContent = `Number of Reviews: ${numReviews}`;
        avgRatingInfo.textContent = `Average Rating Given: ${avgRating}`;

        // Add user reviews to profile:
        const userReviewsContainer = document.getElementById('user-review-list');
        userReviewsContainer.innerHTML = '<h1>User Reviews</h1>'; // Clear existing to remove duplicate generation
        user.reviews.forEach(review => {
          const reviewElement = document.createElement('p');
          reviewElement.innerHTML = `<em>(${review.foodItem})</em> - <span class="bold-text">${review.rating}/5.0:</span> ${review.text} <br>`;
          userReviewsContainer.appendChild(reviewElement);
        });

        // Calculate food statistics
        const ratingCounts = {};
        const foodRatings = {};

        user.reviews.forEach(review => {
          // Count reviews by rating
          ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;

          // Aggregate ratings by food item
          if (!foodRatings[review.foodItem]) {
            foodRatings[review.foodItem] = { totalRating: 0, numReviews: 0 };
          }
          foodRatings[review.foodItem].totalRating += review.rating;
          foodRatings[review.foodItem].numReviews++;
        });

        // Convert food ratings to an array and sort by average rating
        const topFoodItems = Object.keys(foodRatings).map(foodItem => ({
          foodItem,
          avgRating: (foodRatings[foodItem].totalRating / foodRatings[foodItem].numReviews).toFixed(1),
          numReviews: foodRatings[foodItem].numReviews
        })).sort((a, b) => b.avgRating - a.avgRating);

        // Update food statistics
        const foodStatsContainer = document.getElementById('user-food-stats');
        foodStatsContainer.innerHTML = '<h1>Food Statistics</h1>';

        // Display rating counts
        const ratingCountsContainer = document.createElement('div');
        ratingCountsContainer.innerHTML = '<h3>Reviews by Rating:</h3>';

        // Convert the ratingCounts object to an array of [rating, count] pairs, sort by rating in descending order
        const sortedRatingCounts = Object.entries(ratingCounts).sort((a, b) => b[0] - a[0]);

        for (const [rating, count] of sortedRatingCounts) {
          const ratingCountElement = document.createElement('p');
          ratingCountElement.textContent = count === 1 ? `${rating} stars: ${count} review` : `${rating} stars: ${count} reviews`;
          ratingCountsContainer.appendChild(ratingCountElement);
        }

        foodStatsContainer.appendChild(ratingCountsContainer);

        async function getFoodItemCalories(foodName) {
          let foodItemName = foodName.toLowerCase().replace(/\s+/g, '_');
          try {
            const response = await fetch(`http://localhost:3000/api/foods/${foodItemName}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch food item: ${foodItemName}`);
            }
            const foodItem = await response.json();
            return foodItem.calories;
          } catch (error) {
            console.error(`Error fetching food item: ${foodItemName}`, error);
            return 0; // Default to 0 calories if there's an error
          }
        }
        
        
        // Display top food items
        const topFoodItemsContainer = document.createElement('div');
        topFoodItemsContainer.innerHTML = '<h3>Top Food Items by Rating:</h3>';
        
        // Slice the topFoodItems array to get only the top 10 items
        const topTenFoodItems = topFoodItems.slice(0, 10);
        
        // Asynchronously fetch calories for each top food item
        const foodItemsWithCalories = await Promise.all(topTenFoodItems.map(async item => {
          const calories = await getFoodItemCalories(item.foodItem);
          return { ...item, calories };
        }));
        
        // Calculate the average calories of the top 10 food items
        const totalCalories = foodItemsWithCalories.reduce((sum, item) => sum + item.calories, 0);
        const avgCalories = (totalCalories / foodItemsWithCalories.length).toFixed(1);
        
        foodItemsWithCalories.forEach(item => {
          const topFoodItemElement = document.createElement('p');
          topFoodItemElement.innerHTML = item.numReviews === 1 ? 
            `<strong>${item.foodItem}</strong> - ${item.avgRating}/5.0 (${item.numReviews} review) - ${item.calories} calories` : 
            `<strong>${item.foodItem}</strong> - ${item.avgRating}/5.0 (${item.numReviews} reviews) - ${item.calories} calories`;
          topFoodItemsContainer.appendChild(topFoodItemElement);
        });
        
        // Display the average calories information
        const avgCaloriesElement = document.createElement('p');
        avgCaloriesElement.innerHTML = `<strong>Average Calories:</strong> ${avgCalories} calories`;
        topFoodItemsContainer.appendChild(avgCaloriesElement);
        
        foodStatsContainer.appendChild(topFoodItemsContainer);

      } catch (error) {
          console.error('Not logged in', error);
      }
    }

    // Profile Buttons:
    const userInfoBtn = document.getElementById('user-information');
    const userReviewsBtn = document.getElementById('user-reviews');
    const foodStatsBtn = document.getElementById('food-statistics');

    userInfoBtn.addEventListener('click', () => {
      displayProfiles('user-info');
    });

    userReviewsBtn.addEventListener('click', () => {
      displayProfiles('user-review-list');
    });

    foodStatsBtn.addEventListener('click', () => {
      displayProfiles('user-food-stats');
    });

    // Function to switch profile views
    function displayProfiles(pageId){

      // hide all profile views
      document.querySelectorAll(".profile-view").forEach((view) => {
        view.style.display = "none";
      });
  
      // Show the requested view
      document.getElementById(pageId).style.display = "block";
    }

    // ----------------------------------- FOOD TABLE AND SEARCH ----------------------------------- \\
    
    // ---- POPUP CONTAINER ---- \\

    // Popup for food item:
    async function showFoodDetailsPopup(foodItem) {
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

      // Function to leave reviews
      async function leaveReview(reviewText, rating) {
        try {
            // Update food item with new review
            foodItem.reviews.push({ text: reviewText, rating: rating });
            foodItem.totalRatings += rating;
            foodItem.numReviews++;
    
            // Update UI with new rating and numReviews
            const newRating = foodItem.numReviews !== 0 ? (foodItem.totalRatings / foodItem.numReviews).toFixed(1) : 'N/A';
            popupContent.querySelector('p:nth-of-type(1)').textContent = `Rating: ${newRating}/5`;
            popupContent.querySelector('p:nth-of-type(2)').textContent = `Number of Reviews: ${foodItem.numReviews}`;
    
            // Update database with new data
            await updateFoodItemInJSON(foodItem);
    
            // Update user reviews via API if logged in
            const username = getUsername();
            if (username !== 'none') {
                const response = await fetch(`http://localhost:3000/api/users/${username}/reviews`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ foodItem: foodItem.name, text: reviewText, rating: rating }),
                });
                if (!response.ok) {
                    throw new Error('Failed to update user reviews');
                }
                const updatedUser = await response.json();
                console.log('User reviews updated:', updatedUser);
            }
    
            // Update table
            populateTable(foodData);
    
        } catch (error) {
            console.error('Error leaving review:', error);
            alert('An error occurred while leaving the review. Please try again later.');
        }
      }

      // Function to update food item via API
      async function updateFoodItemInJSON(foodItem) {
        try {
          const response = await fetch(`http://localhost:3000/api/foods/${foodItem._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodItem),
          });
          if (!response.ok) {
            throw new Error(`Failed to update food item ${foodItem._id}`);
          }
          const updatedFoodItem = await response.json();
          console.log('Updated food item:', updatedFoodItem);
          return updatedFoodItem;
        } catch (error) {
          console.error('Error updating food item via API:', error);
          throw error;
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
      let foodName = foodItem.name.replace(/\s+/g, '_').toLowerCase();
      let targetFoodItem = null;

      // Iterate through the food items to find the one with the matching name
      for (let key in foodItems) {
        if (foodItems[key].name.replace(/\s+/g, '_').toLowerCase() === foodName) {
          targetFoodItem = foodItems[key];
          break;
        }
      }

      console.log(foodName);
      console.log(foodItems);
      console.log(targetFoodItem);

      // Check if the target food item has reviews
      if (targetFoodItem && targetFoodItem.reviews && targetFoodItem.reviews.length > 0) {
        // Iterate through the reviews and create <p> elements for each
        targetFoodItem.reviews.forEach(review => {
          const reviewText = `${review.rating % 1.0 !== 0 ? review.rating : review.rating+".0"}/5.0: ${review.text}`;
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
        row.classList.add('foodRow'); // Add a class to the row element
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

// Load food data function using API
async function loadFoodData() {
  try {
    // Fetch all food items from API
    const response = await fetch('http://localhost:3000/api/foods');
    if (!response.ok) {
      throw new Error('Failed to fetch food data');
    }
    const foodList = await response.json();
    console.log(foodList);
    return foodList; // Return the array of food items
  } catch (error) {
    console.error('Error loading food data from API:', error);
    throw error; // Propagate the error for further handling
  }
}



// hashing for password security
function hashPassword(password) {
  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  return hashedPassword;
}



// ------------------- ACCESSORY OR INITIALIZATION FUNCTIONS --------------------------\\

/*// Function to populate food_db using API
async function populateFoodDatabaseFromJSON() {
  try {
    const response = await fetch('food_list.json');
    if (!response.ok) {
      throw new Error('Failed to fetch food list JSON');
    }
    const foodList = await response.json();

    const foodDocuments = Object.keys(foodList).map(key => ({
      ...foodList[key],
      _id: key.replace(/\s+/g, '_').toLowerCase() // Generate _id based on name
    }));

    // Function to send a single food item
    async function sendFoodItem(foodItem, retryCount = 3) {
      try {
        const initResponse = await fetch('http://localhost:3000/api/foods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(foodItem),
        });

        if (!initResponse.ok) {
          throw new Error('Failed to create food item');
        }

        return initResponse.json();
      } catch (error) {
        console.error('Error sending food item:', error);
        if (retryCount > 0) {
          console.log(`Retrying food item... attempts left: ${retryCount}`);
          return sendFoodItem(foodItem, retryCount - 1); // Retry
        } else {
          throw error; // If no retries left, throw error
        }
      }
    }

    for (const foodItem of foodDocuments) {
      console.log(`Sending food item with _id: ${foodItem._id}`);
      const result = await sendFoodItem(foodItem);
      console.log('Food item initialization successful:', result);
    }

  } catch (error) {
    console.error('Error populating food database from JSON:', error);
    throw error; // Rethrow the error for further handling
  }
}*/


