// Import required modules and error handlers
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

// Define an array of valid fields for a table
const validField = ["table_name", "capacity"];

// Middleware function to validate the incoming table data
function validTable(req, res, next) {
  const table = req.body.data;

  // Check if the request body contains a 'data' property
  if (!table) {
    return next({ status: 400, message: "Must have data property" });
  }

  // Check if all required fields are present in the table object
  validField.forEach((field) => {
    if (!table[field]) {
      return next({ status: 400, message: `Must have ${field} property.` });
    }
  });

  // Check if the 'capacity' field is a valid number greater than 0
  if (typeof table["capacity"] !== "number" || table["capacity"] <= 0) {
    return next({
      status: 400,
      message: "capacity must be a number greater than 0",
    });
  }

  // Check if the 'table_name' field is at least two characters long
  if (table["table_name"].length < 2) {
    return next({
      status: 400,
      message: "table_name must be at least two characters long.",
    });
  }

  // If all validations pass, continue to the next middleware
  next();
}

// Handler function to list all tables
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

// Handler function to create a new table
async function create(req, res, next) {
  const table = req.body.data;
  
  // Call the service function to create a new table
  const newTable = await service.create(table);
  
  // Add reservation_id and table_id properties to the response
  table.reservation_id = newTable.reservation_id;
  table.table_id = newTable.table_id;
  
  // Respond with a 201 status code and the newly created table
  res.status(201).json({ data: table });
}

// Export the middleware and handler functions
module.exports = {
  list: asyncErrorBoundary(list),
  create: [validTable, asyncErrorBoundary(create)], 
  validTable,                          
};
