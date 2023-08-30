import React, { useState } from "react";
import Form from "./Form";

import { createReservation } from "../utils/api"

export default function Reservations() {
  const history = useHistory();

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const findErrors = (date, errors) => {
    isNotOnTuesday(date, errors);
    isInTheFuture(date, errors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const controller = new AbortController()
    async function newRes() {
        setFormData({ ...initialFormState });
        const { id } = await createReservation(formData)
        console.log(id)
        history.push(`/dashboard?date=${date}`);
    }
    newRes()
  };

  return (
    <>
      <ErrorAlert error={reservationsError} />
      <Form
        initialformData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
