import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import TableCard from "./TableCard";
import { createTable } from "../utils/api";

export default function CreateTable() {
  const history = useHistory();

  const initialForm = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialForm });
  const [tableError, setError] = useState(null);

  const changeHandler = ({ target }) => {
    let value = target.value;
    if (target.name === "capacity") {
      value = Number(value);
    }
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function addTable() {
      try {
        await createTable({ data: formData }, abortController.signal);
        history.push(`/dashboard`);
      } catch (error) {
        setError(error);
      }
    }
    addTable();
    return () => abortController.abort();
  };

  return (
    <div className="centered-content">
      <h1 className="">Create Table</h1>
      <ErrorAlert error={tableError} />
      <TableCard changeHandler={changeHandler} formData={formData} />
      <button className="btn btn-secondary mx-1 mr-2" onClick={history.goBack}>
        Cancel
      </button>
      <button
        form="tableForm"
        type="submit"
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

