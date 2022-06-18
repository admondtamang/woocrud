import React from "react";
import { useDispatch } from "react-redux";
import { loading } from "../../../store/actions";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import DataTable from "../../Skeleton/DataTable";

export default function Template({ children, isLoading, isFetching, error }) {
  const dispatch = useDispatch();
  if (error) return "An error has occurred: " + error.message;

  if (isFetching) {
    dispatch(loading(true, "header-loader"));
  }
  if (!isFetching) {
    dispatch(loading(false, "header-loader"));
  }

  return (
    <div>
      <Header />
      {!isLoading || !isFetching ? children : <DataTable />}
      <Footer />
    </div>
  );
}
