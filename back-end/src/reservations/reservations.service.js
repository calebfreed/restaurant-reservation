const { select } = require("../db/connection"); 
const knex = require("../db/connection"); 

function list() { // Function to list reservations.
  return knex("reservations") 
    .select("*") 
    .whereNotIn("status", ["finished", "cancelled"]) 
    .orderBy("reservations.reservation_date");
}

function create(reservation) { // Function to create a new reservation.
  return knex("reservations as r") 
    .insert(reservation) 
    .returning("*") 
    .then((newReservation) => newReservation[0]); 
}

function listByDate(reservation_date) { // Function to list reservations by date.
  return knex("reservations") 
    .select("*") 
    .where({ reservation_date }) 
    .whereNotIn("status", ["finished", "cancelled"]) 
    .orderBy("reservations.reservation_time"); 
}

function read(reservation_id) { // Function to read a reservation by ID.
  return knex("reservations") 
    .select("*") 
    .where({ reservation_id }) 
    .first(); 
}

function update(reservation_id, status) { // Function to update a reservation's status.
  return knex("reservations") 
    .select("*") 
    .where({ reservation_id }) 
    .update({ status }) 
    .returning("*") 
    .then((updated) => updated[0]); 
}

function finish(reservation_id) { // Function to mark a reservation as 'finished'.
  return knex("reservations") 
    .select("*") 
    .where({ reservation_id }) 
    .update({ status: "finished" }); // Update the 'status' column to 'finished'.
}

function search(mobile_number) { // Function to search for reservations by mobile number.
  return knex("reservations") 
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?", // Perform a raw SQL 'LIKE' query to search for mobile numbers.
      `%${mobile_number.replace(/\D/g, "")}%` // Remove non-digit characters from the provided mobile number and search for it.
    )
    .orderBy("reservation_date"); // Order the results by reservation date.
}

function modify(reservation_id, reservation) { // Function to modify an existing reservation.
  return knex("reservations")
    .select("*")
    .where({ reservation_id }) 
    .update(reservation, "*") 
    .returning("*") 
    .then((updated) => updated[0]); 
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
