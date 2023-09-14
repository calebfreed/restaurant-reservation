import React from "react";

export default function ListTable({ tables, finishHandler }) {
  return (
    <>
      <table className="table">
        <thead className="thead">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.table_id}>
              <th scope="row">{table.table_id}</th>
              <td>{table.table_name}</td>
              <td>{table.capacity}</td>
              <td data-table-id-status={table.table_id}>
                {table.reservation_id === null ? "Free" : "Occupied"}
              </td>
              <td>
                {table.reservation_id !== null && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-table-id-finish={table.table_id}
                    onClick={() => {
                      window.confirm(
                        "Is this table ready to seat new guests? This cannot be undone."
                      ) && finishHandler(table.table_id);
                    }}
                  >
                    Finish
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
