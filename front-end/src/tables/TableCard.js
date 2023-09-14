import React from "react";

export default function TableCard({ changeHandler, formData }) {
  return (
    <>
      <form id="tableForm">
        <div className="form-row mb-3">
          <div className="col">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              id="table_name"
              name="table_name"
              type="text"
              className="form-control"
              placeholder="Table name"
              required
              onChange={changeHandler}
              value={formData.table_name}
            />
          </div>
          <div className="col">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              className="form-control"
              placeholder="capacity"
              required
              onChange={changeHandler}
              value={formData.capacity}
              min="1"
            />
          </div>
        </div>
      </form>
    </>
  );
}

