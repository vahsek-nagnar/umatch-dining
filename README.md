# UMatch Dining
## Project Setup
To get started with the project, follow these steps:
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/vahsek-nagnar/umatch-dining.git
   cd umatch-dining

2. **Updating the Repository:**
   ```sh
   git pull origin main
   git add .
   git commit -m "Message"
   git push origin master
4. **Updating the Repository With a New Branch:**
   ```sh
   git pull origin main
   git checkout -b "YOUR BRANCH NAME"
   git add .
   git commit -m "Message"
   git push origin "YOUR BRANCH NAME"

## About UMatch Dining:

UMatch Dining is a web application in which UMass diners can rate and review the various culinary options offered at the four Dining Halls. In depth personalized statistics will be offered to account holders.

## How to use:

The reviews of food items are available for everyone to view, but individually catered information and the posting of reviews require an account to be made. The site was designed to be intuitive and user friendly, so it should not be difficult to navigate.

## Installation Instructions

### Prerequisites

- Node.js
- npm
- express.js
- pocketDB

### Steps for Backend Server

1. **Change Directory**

   ```bash
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Server**

   ```bash
   node server.js
   ```

   The server will run on `http://localhost:3000`.

## API Usage

#### Get All Foods

- **Endpoint:** `http://localhost:3000/api/foods`
- **HTTP Method:** `GET`
- **Description:** Retrieve all food items.
- **Parameters:** None
- **Response Body:**

  ```json
  [
      {
          "_id": "potato",
          "name": "Potato",
          "reviews": [],
          "totalRatings": 0,
          "numReviews": 0
      },
      // More food items...
  ]
  ```

#### Get a Specific Food by ID

- **Endpoint:** `http://localhost:3000/api/foods/:id`
- **HTTP Method:** `GET`
- **Description:** Retrieve a specific food item by its ID.
- **Parameters:**
  - `id` (string): The ID of the food item.
- **Response Body:**

  ```json
  {
      "_id": "potato",
      "name": "Potato",
      "reviews": [],
      "totalRatings": 0,
      "numReviews": 0
  }
  ```

#### Create a New Food

- **Endpoint:** `http://localhost:3000/api/foods`
- **HTTP Method:** `POST`
- **Description:** Create a new food item.
- **Request Body:**

  ```json
  {
      "name": "Potato"
  }
  ```

- **Response Body:**

  ```json
  {
      "ok": true,
      "id": "potato",
  }
  ```

#### Update a Food by ID

- **Endpoint:** `http://localhost:3000/api/foods/:id`
- **HTTP Method:** `PUT`
- **Description:** Update an existing food item by its ID.
- **Parameters:**
  - `id` (string): The ID of the food item.
- **Request Body:**

  ```json
  {
      "name": "Potato",
      "reviews": [],
      "totalRatings": 0,
      "numReviews": 0
  }
  ```

- **Response Body:**

  ```json
  {
      "ok": true,
      "id": "potato",
  }
  ```

#### Delete a Food by ID

- **Endpoint:** `http://localhost:3000/api/foods/:id`
- **HTTP Method:** `DELETE`
- **Description:** Delete a specific food item by its ID.
- **Parameters:**
  - `id` (string): The ID of the food item.
- **Response Body:**

  ```json
  {
      "ok": true,
      "id": "potato",
  }
  ```

### User API Endpoints

#### Get All Users

- **Endpoint:** `http://localhost:3000/api/users`
- **HTTP Method:** `GET`
- **Description:** Retrieve all users.
- **Parameters:** None
- **Response Body:**

  ```json
  [
      {
          "_id": "user1",
          "name": "UserOne",
          "reviews": []
      },
      // More users...
  ]
  ```

#### Get a Specific User by ID

- **Endpoint:** `http://localhost:3000/api/users/:id`
- **HTTP Method:** `GET`
- **Description:** Retrieve a specific user by their ID.
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response Body:**

  ```json
  {
      "_id": "user1",
      "name": "UserOne",
      "reviews": []
  }
  ```

#### Create a New User

- **Endpoint:** `http://localhost:3000/api/users`
- **HTTP Method:** `POST`
- **Description:** Create a new user.
- **Request Body:**

  ```json
  {
      "name": "UserOne"
  }
  ```

- **Response Body:**

  ```json
  {
      "ok": true,
      "id": "user1",
  }
  ```

#### Update a User by ID

- **Endpoint:** `http://localhost:3000/api/users/:id`
- **HTTP Method:** `PUT`
- **Description:** Update an existing user by their ID.
- **Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:**

  ```json
  {
      "name": "UserOne",
      "reviews": []
  }
  ```

- **Response Body:**

  ```json
  {
      "ok": true,
      "id": "user1",
  }
  ```

#### Delete a User by ID

- **Endpoint:** `http://localhost:3000/api/users/:id`
- **HTTP Method:** `DELETE`
- **Description:** Delete a specific user by their ID.
- **Parameters:**
  - `id` (string): The ID of the user.
- **Response Body:**

  ```json
  {
      "ok": true,
      "id": "user1",
  }
  ```

#### Update User Reviews

- **Endpoint:** `http://localhost:3000/api/users/:username/reviews`
- **HTTP Method:** `PUT`
- **Description:** Update the reviews for a specific user.
- **Parameters:**
  - `username` (string): The username of the user.
- **Request Body:**

  ```json
  {
      "foodItem": "Potato",
      "text": "Yum!",
      "rating": 5
  }
  ```

- **Response Body:**

  ```json
  {
      "_id": "user1",
      "name": "UserOne",
      "reviews": [
          {
              "foodItem": "Potato",
              "text": "Yum!",
              "rating": 5
          }
      ]
  }
  ```