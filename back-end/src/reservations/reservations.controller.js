//Import proper services and error handling
const asyncErrorBoundary = require("../errors/asyncErrorBoundary"); // Middleware for handling asynchronous errors.
const service = require("./reservations.service"); // Import service for reservation management.

const reservationFields = [ // Define valid fields for a reservation.
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function _validateTime(str) { // Helper function to validate time.
  const [hour, minute] = str.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

function validReservation(req, res, next) { // Middleware to validate a reservation.
  const reservation = req.body.data;

  if (!reservation) { // Check if data property is present.
    return next({ status: 400, message: `Must have data property.` });
  }

  reservationFields.forEach((field) => { // Iterate through fields for validation.
    if (!reservation[field]) { // Check if required fields are present.
      return next({ status: 400, message: `${field} field required` });
    }

    if (field === "people" && typeof reservation[field] !== "number") { // Validate data types.
      return next({
        status: 400,
        message: `${reservation[field]} is not a number type for people field.`,
      });
    }

    if (field === "reservation_date" && !Date.parse(reservation[field])) { // Check for valid date.
      return next({ status: 400, message: `${field} is not a valid date.` });
    }

    if (field === "reservation_time") { // Validate reservation time using _validateTime function.
      if (!_validateTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time` });
      }
    }
  });

  next(); // Move to the next middleware or route handler.
}

function notTuesday(req, res, next) { // Middleware to check if reservation is not on Tuesday.
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month} ${day}, ${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) { // Check if it's Tuesday (day 2).
    return next({ status: 400, message: "Location is closed on Tuesdays" });
  }
  next(); // Move to the next middleware or route handler.
}

function futuristic(req, res, next) { // Middleware to check if the reservation date is in the future.
  const date = res.locals.date;
  const today = new Date();
  if (date < today) { // Compare with the current date.
    return next({ status: 400, message: "Must be a future date" });
  }
  next(); // Move to the next middleware or route handler.
}

function isOpen(req, res, next) { // Middleware to check if reservation time is within business hours.
  const reservation = req.body.data;
  const [hour, minute] = reservation.reservation_time.split(":");
  if (hour < 10 || hour > 21) { // Check if the hour is outside business hours.
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) { // Additional check for precise business hours.
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  next(); // Move to the next middleware or route handler.
}

function isBooked(req, res, next) { // Middleware to check if a new reservation has valid status.
  const { status } = res.locals.reservation
    ? res.locals.reservation
    : req.body.data;
  if (status === "seated" || status === "finished" || status === "cancelled") { // Check for invalid statuses.
    return next({
      status: 400,
      message: `New reservation can not have ${status} status.`,
    });
  }
  next(); // Move to the next middleware or route handler.
}

function isValidStatus(req, res, next) { // Middleware to validate reservation status.
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!validStatus.includes(status)) { // Check if status is unknown.
    return next({ status: 400, message: "Status unknown." });
  }
  next(); // Move to the next middleware or route handler.
}

function finished(req, res, next) { // Middleware to check if a reservation is already finished.
  const { status } = res.locals.reservation;
  if (status === "finished") { // Check if the status is finished.
    return next({
      status: 400,
      message: "Cannot change a reservation with a finished status.",
    });
  }
  next(); // Move to the next middleware or route handler.
}

const reservationExists = async (req, res, next) => { // Middleware to check if a reservation exists.
  const { reservation_Id } = req.params;
  const reservation = await service.read(reservation_Id);

  if (reservation) { // If reservation is found, store it in res.locals and move to the next middleware.
    res.locals.reservation = reservation;
    return next();
  }
  next({ // If reservation is not found, send a 404 error.
    status: 404,
    message: `Reservation_id ${reservation_Id} does not exist.`,
  });
};

async function list(req, res) { // List reservations based on query parameters.
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) { // If mobile_number is provided, search by mobile number.
    reservations = await service.search(mobile_number);
  } else { // Otherwise, list by date or list all reservations.
    reservations = date ? await service.listByDate(date) : await service.list();
  }
  res.json({
    data: reservations,
  });
}

async function create(req, res) { // Create a new reservation.
  const reservation = req.body.data;
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

async function read(req, res) { // Read and return a specific reservation.
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

async function update(req, res, next) { // Update the status of a reservation.
  const { reservation_Id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.update(reservation_Id, status);
  res.json({ data: reservation });
}

async function modify(req, res, next) { // Modify an existing reservation.
  const { reservation_Id } = req.params;
  const reservation = req.body.data;
  const data = await service.modify(reservation_Id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}

module.exports = { // Export middleware and CRUD functions.
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validReservation), notTuesday, futuristic, isOpen, isBooked, asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)
  ],
  update: [
    asyncErrorBoundary(reservationExists), isValidStatus, finished, asyncErrorBoundary(update),
  ],
  modify: [
    validReservation, notTuesday, futuristic, isOpen, asyncErrorBoundary(reservationExists), isBooked, asyncErrorBoundary(modify),
  ],
};
