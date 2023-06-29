const { connectToDB, sequelize } = require('./db/connection');
const Employee = require('./db/model/Employee')
const Contact = require('./db/model/Contact')
const employeeRouter = require('./api/Employee')
const { config } = require('dotenv');
config();

const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");

const express = require("express")
const cors = require('cors')

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.1.0',
    info: {
      title: "Employee contact API(Task)",
      version: "1.0.0",
      description: "This is a simple Employee Contact Info CRUD",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  apis: ['./src/api/*.js'],
};
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/employee', employeeRouter);

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectToDB();