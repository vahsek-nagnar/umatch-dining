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
      .addEventListener("click", () => navigate("profileView"));
    document
      .getElementById("about")
      .addEventListener("click", () => navigate("aboutView"));
    document
      .getElementById("login")
      .addEventListener("click", () => navigate("loginView"));
    // Initialize with the home view
    navigate("homeView");
  
    // Assuming your imratings are within a container with the class
    // 'imrating-container'
    document.querySelectorAll(".imrating-container img").forEach((img) => {
      img.addEventListener("click", function () {
        const parent = this.parentNode;
        parent.insertBefore(this, parent.firstChild); // Move the clicked imrating to the beginning
      });
    });

    // Menu button and sidebar function:
    let menuBtn = document.querySelector('#menu');
    let sidebar = document.querySelector('.sidebar');

    menuBtn.onclick = function() {
        sidebar.classList.toggle('active');
        console.log("menu clicked")
    };

    // Login handling:
    // TODO: (requires database for authentication?)



    // ----------------------------------- Food Table and Search: ----------------------------------- \\
    

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
          <p>Rating: ${foodItem.rating}</p>
          <p>Number of Reviews: ${foodItem.numReviews}</p>
      `;
      
      // Close button for the popup
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', () => {
          popupContainer.remove(); // Remove the popup when close button is clicked
      });
      
      popupContent.appendChild(closeButton);
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

