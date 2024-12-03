# Donicci - Sock Selling Website

Welcome to **Donicci**, a stylish online store for all your sock needs! This project is built using React for the frontend and Node.js for the backend, with HTML and Bootstrap 5 for the design.

![image](https://github.com/user-attachments/assets/3133a0d4-7de9-4679-96d9-e271a1c39f05)


## Table of Contents
1. [Project Description](#project-description)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Usage](#usage)
8. [Project Structure](#project-structure)
9. [Contributing](#contributing)
10. [License](#license)

## Project Description

Donicci is an e-commerce platform that focuses on selling a variety of stylish and comfortable socks. Users can browse products, add them to their cart, and make purchases seamlessly.

## Features

1. **User Authentication**
   - Secure login and registration for customers using JWT (JSON Web Tokens).
   - Password encryption for user data protection.

2. **Product Catalog**
   - Browse a wide range of socks categorized by style, color, size, and price.
   - Detailed product descriptions, images, and user reviews to help customers make informed decisions.

3. **Shopping Cart**
   - Add or remove items to the shopping cart with ease.
   - View cart details, including item quantities, prices, and a summary of the total cost.

4. **Order Management**
   - Seamless checkout process with order summary and payment options.
   - Track order status from processing to shipment and delivery.

5. **Search and Filters**
   - Advanced search functionality to quickly find products based on keywords.
   - Filter products by categories, price range, ratings, and availability.

6. **Discounts and Offers**
   - Special discounts and promotional offers available for various products.
   - Display of ongoing sales events and exclusive deals to encourage purchases.

7. **Customer Reviews and Ratings**
   - Users can leave reviews and ratings for products they have purchased.
   - Average ratings displayed on the product page to help guide customer decisions.

8. **Responsive Design**
   - Mobile-friendly design using Bootstrap 5 for optimal viewing on all devices.
   - Easy navigation with a clean and modern UI.

9. **Secure Payment Integration**
   - Integration with payment gateways for secure online transactions.
   - Multiple payment methods supported (credit/debit cards, PayPal, etc.).

10. **Admin Dashboard**
   - Admin functionality to manage products, orders, users, and reviews.
   - Ability to update stock information, add new products, and process orders.

## Technologies Used

- **Frontend:** React, HTML, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Libraries and Middleware:**
  - `express`
  - `mongoose`
  - `cors`
  - `dotenv`
  - Custom routes: `userRoutes`, `productRoutes`, `categoryRoutes`, `orderRoutes`, `reviewRoutes`, `cartRoutes`, `offerRoutes`, `saleRouter`
  - Middleware: `authenticateToken`, `notFoundHandler`, `errorHandler`
  

## Installation

### Prerequisites

Make sure you have the following installed:
- Node.js and npm
- Git

### Backend Setup

1. **Create a `.env` file** in the backend directory:
   If you don't already have one, create a file named `.env` in your backend directory. This file will store all the necessary environment variables for your application.

2. **Add your environment variables** to the `.env` file:
   Here's the setup for your Donicci project:

   ```env
   MONGODB_URI=mongodb+srv://Donicci:MERN@cluster0.zctmmxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=HanenShaban12233
   PORT=3000
   ```

   - `MONGODB_URI`: This is the MongoDB connection string used for your database.
   - `JWT_SECRET`: Your JWT secret key for token generation and authentication.
   - `PORT`: The port number on which your backend server should run (e.g., 3000).

**Important:** Keep the `.env` file private and avoid sharing it publicly or committing it to version control to ensure your sensitive data remains secure. 

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

Once the application is set up, you can navigate to the following endpoints:

- **Home Page:** [http://localhost:3000](http://localhost:3000)
- **Login:** Go to `/login` to authenticate.
- **Products:** Browse available socks at `/products`.

## Project Structure

```
/backend
    ├── models
    ├── routes
    ├── controllers
    ├── middlewares
    ├── .env
    ├── index.js
    └── uploads

/frontend
    ├── src
        ├── components
        ├── pages
        ├── Rtk
        └── App.js
```

## Contributing

We welcome contributions to Donicci! If you'd like to contribute, follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Create a new Pull Request.

## License
This project does not currently have a license. If you're interested in using or contributing to this project, please contact the project owner.


