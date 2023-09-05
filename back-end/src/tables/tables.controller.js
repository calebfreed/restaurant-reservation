const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const hasValidProperties = require("../errors/hasValidProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];
const requiredProperties = ["table_name", "capacity"];

const hasValidFields = hasValidProperties(VALID_PROPERTIES);

const hasRequiredProperties = hasProperties(...requiredProperties);

function tableNameIsValid(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be at least 2 characters long",
    });
  }
  next();
}

function capacityIsANumber(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === "string") {
    next({ status: 400, message: "capacity must be a number greater than 0" });
  }
  next();
}

function capacityIsGreaterThanZero(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity < 1) {
    next({ status: 400, message: "Table capacity must be at least 1" });
  }
  next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 404,
      message: `Table id ${req.params.tableId} does not exist`,
    });
  }
}

async function list(req, res, next) {
  const data = await service.list();
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidFields,
    hasRequiredProperties,
    tableNameIsValid,
    capacityIsANumber,
    capacityIsGreaterThanZero,
    asyncErrorBoundary(create),
  ],
  tableExists: asyncErrorBoundary(tableExists),
};