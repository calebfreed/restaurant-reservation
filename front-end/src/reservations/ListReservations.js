import React from "react";

export default function ListReservations({ reservations, cancelHandler }) {
  const path = window.location.pathname;

  return (
    <>
      <table className="table" striped bordered hover>
        <thead className="thead">
          <tr>
            <th scope="col">Id</th>
            {path.includes("search") && <th scope="col">Reservation Date:</th>}
            <th scope="col">Reservation Time:</th>
            <th scope="col">First Name:</th>
            <th scope="col">Last Name:</th>
            <th scope="col">Party Size:</th>
            <th scope="col">Phone Number:</th>
            <th scope="col">Status:</th>
            <th scope="col">Actions:</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length !== 0 ? (
            reservations.map((reservation) => (
              <tr key={reservation.reservation_id}>
                <th scope="row">{reservation.reservation_id}</th>
                {path.includes("search") && (
                  <td>{reservation.reservation_date}</td>
                )}
                <td>{reservation.reservation_time}</td>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.people}</td>
                <td>{reservation.mobile_number}</td>
                <td data-reservation-id-status={reservation.reservation_id}>
                  {reservation.status}
                </td>
                <td>
                  {reservation.status !== "seated" &&
                    reservation.status !== "finished" &&
                    reservation.status !== "cancelled" && (
                      <a
                        style={{ width: 70 }}
                        className="btn btn-success"
                        href={`/reservations/${reservation.reservation_id}/seat`}
                        role="button"
                      >
                        Seat
                      </a>
                    )}
                  {reservation.status === "booked" && (
                    <a
                      style={{ width: 70 }}
                      className="btn btn-secondary"
                      href={`/reservations/${reservation.reservation_id}/edit`}
                      role="button"
                    >
                      Edit
                    </a>
                  )}
                  {reservation.status === "booked" && (
                    <button
                      type="button"
                      style={{ width: 70 }}
                      className="btn btn-danger"
                      data-reservation-id-cancel={reservation.reservation_id}
                      onClick={() => {
                        window.confirm(
                          "Do you want to cancel this reservation? This cannot be undone."
                        ) && cancelHandler(reservation.reservation_id);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No reservations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
