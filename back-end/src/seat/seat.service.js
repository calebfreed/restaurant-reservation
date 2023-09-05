const knex = require("../db/connection");
const { read } = require("../reservations/reservations.service");
const { updateStatus } = require("../reservations/reservations.service");
var types = require("pg").types;

// types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));

const readReservationId = read;

const updateReservationStatus = updateStatus;

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((data) => data[0]);
}

function unassignReservation(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update({ reservation_id: null }, "*")
    .then((data) => data[0]);
}

function seatReservationAtTable(updatedTable, reservationId) {
  return knex.transaction((t) => {
    knex("tables")
      .transacting(t)
      .then(update(updatedTable))
      .then(updateReservationStatus(reservationId, "seated"))
      .then(readReservationId(reservationId))
      .then(t.commit)
      .catch(function (e) {
        t.rollback();
        throw e;
      });
  });
}

function finishSeatReservation(tableId, reservationId) {
  return knex.transaction((t) => {
    knex("tables")
      .transacting(t)
      .then(unassignReservation(tableId))
      .then(updateReservationStatus(reservationId, "finished"))
      .then(t.commit)
      .catch(function (e) {
        t.rollback();
        throw e;
      });
  });
}

module.exports = {
  update,
  readReservationId,
  seatReservationAtTable,
  finishSeatReservation,
};