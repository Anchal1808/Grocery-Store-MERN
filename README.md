# 🛒 Grocery Store MERN

A full-stack **Grocery Store web application** built using the **MERN stack**. Users can browse grocery products, view product details, add items to their cart, place orders, and manage their account.

---

## 🚀 Features

### 👤 User Authentication
- User registration and login
- Secure password handling
- Authentication using JWT
- Protected routes for authenticated users

### 🛍️ Product Management
- Browse all grocery products
- Product categories
- Best-selling products section
- Product details page
- Product images, prices, descriptions, and availability

### 🛒 Shopping Cart
- Add products to cart
- Increase/decrease product quantity
- Remove products from cart
- Automatic cart total calculation
- Persistent cart state

### 💳 Checkout
- Review cart items before ordering
- Enter delivery details
- Order summary
- Place orders securely

### 📦 Orders
- View previous orders
- Track ordered products
- View order details
- Order history for logged-in users

### 🎨 Responsive UI
- Clean and modern interface
- Responsive design
- Navigation bar
- Categories section
- Best sellers section
- Features section
- Footer
- Product cards
- Login modal

---

## 🧑‍💻 Tech Stack

### Frontend

- React.js
- React Router
- JavaScript
- HTML5
- CSS3
- Context API
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Database

- MongoDB Atlas

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 📁 Project Structure

```text
Grocery_Website/
│
├── backend/
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
