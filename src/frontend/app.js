document.addEventListener("DOMContentLoaded", () => {
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
          <p>Rating: ${foodItem.rating}/5</p>
          <p>Number of Reviews: ${foodItem.numReviews}</p>
          <p>Dietary Info: </p>
      `;
      
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
        // Replace with your logic to handle leaving a review for this food item
        const review = prompt(`Leave a review for ${foodItem.name}:`);
        if (review) {
            alert(`You left a review for ${foodItem.name}: ${review}`);
            // Here you can process the review (e.g., send it to a server, update UI, etc.)
        }
      });
      
      popupContent.appendChild(closeButton);
      popupContent.appendChild(leaveReviewButton);
      popupContainer.appendChild(popupContent);
      
      document.body.appendChild(popupContainer); // Append the popup to the body or a container
    }

    // TODO: (pull data from database) for all food items
    const foodData = [ // example data only
      { name: 'Yucca Fries', rating: 3.8, numReviews: 46 },
      { name: 'Salt & Pepper Tofu', rating: 5.0, numReviews: 54 },
      { name: 'Kelp Burger', rating: 1.3, numReviews: 17 }
    ];

    // Dynamically update search from search bar
    

    // TODO: filter foodData item by search

    const tableBody = document.querySelector('#data-table tbody');

    foodData.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('foodRow'); // Add a class to the <tr> element
        row.id = item.name; // Set the id attribute


        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const ratingCell = document.createElement('td');
        ratingCell.textContent = item.rating;
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

    // ------------------------------ End Food Table and Search: ------------------------------ \\

  });

