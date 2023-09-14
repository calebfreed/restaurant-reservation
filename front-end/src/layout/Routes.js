import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservations from "../reservations/CreateReservations";
import SeatReservations from "../reservations/SeatReservations";
import CreateTable from "../tables/CreateTable";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import Search from "../search/Search";
import EditReservations from "../reservations/EditReservations";

function Routes() {
  const query = useQuery();
  const date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservations />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservations />
      </Route>
      <Route path="/reservations/new">
        <CreateReservations />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
