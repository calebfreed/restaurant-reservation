import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, cancelReservation } from "../utils/api";
import ListReservations from "../reservations/ListReservations";

export default function Search() {
  const initialFormState = {
    mobile_number: "",
  };

  const [foundReservations, setFoundReservations] = useState([]);
  const [formData, setFormData] = useState({ ...initialFormState });
  const [foundReservationsError, setFoundReservationsError] = useState(null);
  const [displayResults, setDisplayResults] = useState(false);

  const handleChange = ({ target }) => {
    let value = target.value;

    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  async function findReservations() {
    const abortController = new AbortController();
    try {
      const { mobile_number } = formData;
      const data = await listReservations(
        { mobile_number },
        abortController.signal
      );
      setFoundReservations([...data]);
    } catch (error) {
      setFoundReservationsError(error);
    }
    return () => abortController.abort();
  }

  const handleFind = () => {
    findReservations();
    setDisplayResults(true);
  };

  const handleCancel = (reservation_id) => {
    const abortController = new AbortController();
    async function cancel() {
      try {
        await cancelReservation(reservation_id, abortController.signal);
      } catch (error) {
        setFoundReservationsError(error);
      }
    }
    cancel().then(handleFind);
    return () => abortController.abort();
  };

  return (
    <>
      {displayResults ? (
        <div className="row">
          <h1>Found Resevations</h1>
          <div>
            <button
              type="button"
              className="btn btn-primary ml-3 mt-2"
              onClick={() => {
                setFoundReservations([]);
                setFormData({ ...initialFormState });
                setDisplayResults(false);
              }}
            >
              New Search
            </button>
          </div>
        </div>
      ) : (
        <h1>Search</h1>
      )}
      <ErrorAlert error={foundReservationsError} />
      {displayResults ? (
        <ListReservations
          reservations={foundReservations}
          handleCancel={handleCancel}
        />
      ) : (
        <div className="row">
          <div className="col">
              <form id="searchForm">
                <div className="form-row">
                  <div className="col">
                    <label className="form-label" htmlFor="mobile_number">
                      Mobile Number
                    </label>
                    <input
                      id="mobile_number"
                      name="mobile_number"
                      type="tel"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      className="form-control"
                      placeholder="Enter a customer's phone number"
                      required
                      onChange={handleChange}
                      value={formData.mobile_number}
                    />
                  </div>
                </div>
              </form>
          </div>
          <div className="col">
            <p className="form-label pb-3"></p>
            <button
              form="searchForm"
              type="submit"
              className="btn btn-primary"
              onClick={handleFind}
            >
              Find
            </button>
          </div>
        </div>
      )}
    </>
  );
}
