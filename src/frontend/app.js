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
    });

    // Row clicking
    document.querySelectorAll("tr").forEach((row) => {
      row.addEventListener("click", function () {
        // TODO: brings up information for food item
      });
    });

    // ------------------------------ End Food Table and Search: ------------------------------ \\

  });

