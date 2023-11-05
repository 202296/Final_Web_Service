# FINAL WEB SERVICE

Welcome to our Last Project to build a fully-functional Backend. We did this backend using stack (MongoDB, ExpressJS, React and Node.JS).

Watch it on Youtube:


## Demo Website

- 👉 Render : 
- 👉 Render :
- 👉 Render :
- 👉 Render :

## We did it with

- HTML5 and CSS3: Semantic Elements, CSS Grid, Flexbox
- Context API: Store, Reducers, Actions
- Node & Express: Web API, Body Parser, File Upload, JWT
- MongoDB: Mongoose, Aggregation
- Development: ESLint, Babel, Git, Github,
- Deployment: Renders

## Run Locally

### 1. Clone repo

```
$ git clone https://github.com/202296/Final_Web_Service.git
$ cd final_web_service
```

### 2. Create .env File

- duplicate .env.example in backend folder and rename it to .env

### 3. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - In .env file update MONGODB_URI=mongodb://localhost/library
- OR Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Backend

```
$ cd backend
$ npm install
$ npm start
```

### 5. Seed Users and Products

- Run this on browser: http://localhost:8800/api/seed
- It returns admin email and password and 6 sample products

### 6. Admin Login

- Run http://localhost:8800/signin
- Enter admin email and password and click signin