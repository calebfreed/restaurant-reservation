import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  finishReservation,
  cancelReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "../reservations/ListReservations"
import ListTables from "../tables/ListTable";
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();
  

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const finishHandler = (table_id) => {
    const abortController = new AbortController();
    async function freeTable() {
      try {
        await finishReservation(table_id, abortController.signal);
      } catch (error) {
        setTablesError(error);
      }
    }
    freeTable().then(loadDashboard);
    return () => abortController.abort();
  };

  const cancelHandler = (reservation_id) => {
    const abortController = new AbortController();
    async function cancel() {
      try {
        await cancelReservation(reservation_id, abortController.signal);
      } catch (error) {
        setReservationsError(error);
      }
    }
    cancel().then(loadDashboard);
    return () => abortController.abort();
  };

  useEffect(loadDashboard, [date]);
  
  return (
    <main>
      <h2>Dashboard</h2>
      <div className="d-md-flex mb-3">
      <button
          type="button"
          className="btn btn-secondary"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => history.push("/dashboard")}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
        <h4 className="mb-0">Reservations for: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ListReservations reservations={reservations} cancelHandler={cancelHandler}/>
      <ListTables tables={tables} finishHandler={finishHandler} />
      
    </main>
  );
}

export default Dashboard;
