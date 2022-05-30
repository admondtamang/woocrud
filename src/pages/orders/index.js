import React from "react";

import MaterialTable from "material-table";
import { connect } from "react-redux";

function Orders() {
  return (
    // <MaterialTable
    //   columns={[
    //     { title: "Adı", field: "name" },
    //     { title: "Soyadı", field: "surname" },
    //     { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
    //     { title: "Doğum Yeri", field: "birthCity", lookup: { 34: "İstanbul", 63: "Şanlıurfa" } },
    //   ]}
    //   data={[{ name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 }]}
    //   title="Demo Title"
    // />
    <p>sdl</p>
  );
}
const mapStateToProps = ({ USER, WOO_PRODUCTS }) => ({ USER, WOO_PRODUCTS });

export default connect(mapStateToProps)(Orders);
