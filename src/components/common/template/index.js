import React from "react";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";

export default function Template({ children, isLoading, isFetching, error }) {
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <Header />
      {!isLoading || !isFetching ? children : "Loading..."}
      <Footer />
    </div>
  );
}
