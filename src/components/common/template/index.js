import React from "react";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";

export default function Template({ children, isLoading, error }) {
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <Header />
      {!isLoading ? children : "Loading..."}
      <Footer />
    </div>
  );
}
