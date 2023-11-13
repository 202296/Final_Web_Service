# FINAL WEB SERVICE

Welcome to our Last Project to build a fully-functional Backend. We did this backend using Mearn stack (MongoDB, ExpressJS, React and Node.JS).

Watch it on Youtube:


## Demo Website

- 👉 Render : https://final-web-service.onrender.com/api/user/all-users
- 👉 Render : https://final-web-service.onrender.com/api/user/book/
- 👉 Render : https://final-web-service.onrender.com/api/user/reviews
- 👉 Render : https://final-web-service.onrender.com/api/user/meetings

## We did it with

- Node & Express: Web API, Body Parser, JWT
- MongoDB: Mongoose, Aggregation
- Development: ESLint, Git, Github
- Deployment: Renders

## Run Locally

### 1. Clone repo

```
$ git clone https://github.com/202296/Final_Web_Service.git
$ cd Final_Web_Service
```

### 2. Create .env File

- duplicate .env.example in Final_Web_Service folder and rename it to .env

### 3. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - In .env file update MONGODB_URI=mongodb://localhost/library
- OR Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Final_Web_Service

```
$ cd FINAL_WEB_SERVICE
$ npm install
$ npm start
```

### 5. All Users

- Run this on browser: http://localhost:8800/api/user/all-users
- It returns all users

### 6. Admin Login

- Run http://localhost:8800/api/user/admin-login
- Enter admin email and password and click signin