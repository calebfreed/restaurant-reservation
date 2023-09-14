const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const validField = ["table_name", "capacity"];

// Middleware function to validate the incoming table data
function validTable(req, res, next) {
  const table = req.body.data;

  if (!table) {
    return next({ status: 400, message: "Must have data property" });
  }

  validField.forEach((field) => {
    if (!table[field]) {
      return next({ status: 400, message: `Must have ${field} property.` });
    }
  });

  if (typeof table["capacity"] !== "number" || table["capacity"] <= 0) {
    return next({
      status: 400,
      message: "capacity must be a number greater than 0",
    });
  }

  if (table["table_name"].length < 2) {
    return next({
      status: 400,
      message: "table_name must be at least two characters long.",
    });
  }
  next();
}

async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

// Handler function to create a new table
async function create(req, res, next) {
  const table = req.body.data;

  const newTable = await service.create(table);
  
  table.reservation_id = newTable.reservation_id;
  table.table_id = newTable.table_id;
  
  res.status(201).json({ data: table });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validTable, asyncErrorBoundary(create)], 
  validTable,                          
};
