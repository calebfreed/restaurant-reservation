const { select } = require("../db/connection"); // Import the 'select' function from the database connection.
const knex = require("../db/connection"); // Import the Knex.js library and the database connection.

function list() { // Function to list reservations.
  return knex("reservations") // Use the 'reservations' table.
    .select("*") // Select all columns.
    .whereNotIn("status", ["finished", "cancelled"]) // Exclude reservations with 'finished' or 'cancelled' status.
    .orderBy("reservations.reservation_date"); // Order the results by reservation date.
}

function create(reservation) { // Function to create a new reservation.
  return knex("reservations as r") // Use the 'reservations' table with an alias 'r'.
    .insert(reservation) // Insert the provided reservation data.
    .returning("*") // Return all columns of the newly created reservation.
    .then((newReservation) => newReservation[0]); // Extract the first item from the result (newly created reservation).
}

function listByDate(reservation_date) { // Function to list reservations by date.
  return knex("reservations") // Use the 'reservations' table.
    .select("*") // Select all columns.
    .where({ reservation_date }) // Filter by the provided reservation date.
    .whereNotIn("status", ["finished", "cancelled"]) // Exclude 'finished' or 'cancelled' reservations.
    .orderBy("reservations.reservation_time"); // Order the results by reservation time.
}

function read(reservation_id) { // Function to read a reservation by ID.
  return knex("reservations") // Use the 'reservations' table.
    .select("*") // Select all columns.
    .where({ reservation_id }) // Filter by the provided reservation ID.
    .first(); // Return the first matching result (should be unique by ID).
}

function update(reservation_id, status) { // Function to update a reservation's status.
  return knex("reservations") // Use the 'reservations' table.
    .select("*") // Select all columns.
    .where({ reservation_id }) // Filter by the provided reservation ID.
    .update({ status }) // Update the 'status' column with the provided status.
    .returning("*") // Return all columns of the updated reservation.
    .then((updated) => updated[0]); // Extract the first item from the result (updated reservation).
}

function finish(reservation_id) { // Function to mark a reservation as 'finished'.
  return knex("reservations") // Use the 'reservations' table.
    .select("*") // Select all columns.
    .where({ reservation_id }) // Filter by the provided reservation ID.
    .update({ status: "finished" }); // Update the 'status' column to 'finished'.
}

function search(mobile_number) { // Function to search for reservations by mobile number.
  return knex("reservations") // Use the 'reservations' table.
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?", // Perform a raw SQL 'LIKE' query to search for mobile numbers.
      `%${mobile_number.replace(/\D/g, "")}%` // Remove non-digit characters from the provided mobile number and search for it.
    )
    .orderBy("reservation_date"); // Order the results by reservation date.
}

function modify(reservation_id, reservation) { // Function to modify an existing reservation.
  return knex("reservations") // Use the 'reservations' table.
    .select("*") // Select all columns.
    .where({ reservation_id }) // Filter by the provided reservation ID.
    .update(reservation, "*") // Update the reservation data with the provided changes and return all columns.
    .returning("*") // Return all columns of the modified reservation.
    .then((updated) => updated[0]); // Extract the first item from the result (modified reservation).
}

module.exports = {
  list,
  create,
  listByDate,
  read,
  finish,
  update,
  search,
  modify,
};
