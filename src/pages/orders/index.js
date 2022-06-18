import React, { useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import API from "../../API/";
import AntTable from "../../components/ant-table";
import { Switch } from "antd";
import { useQuery } from "react-query";
import Template from "../../components/common/template";
import useOrderColumns from "./useOrderColumns";

const Orders = ({ USER }) => {
  const [pager, setPager] = useState(1);
  const [limit, setLimit] = useState(5);
  const [switchPreview, setSwichPreview] = useState(true);
  const orderColumns = useOrderColumns();

  const getWooProducts = async () => {
    const result = await API.WC_getWooOrders(USER.token, limit, pager);
    return result;
  };

  const { isLoading, error, data } = useQuery("orders", getWooProducts);

  console.log(data);
  const productsCount = data?.headers["x-wp-total"];

  const pageChangeHandler = (pg, pageSize) => {
    setPager(pg);
    setLimit(pageSize);
  };

  const handleTableSwitch = () => {
    setSwichPreview(!switchPreview);
  };

  return (
    <Template isLoading={isLoading} error={error}>
      {/* handleTableSwitch */}
      <>
        <div className="bg-black">
          <h1>Switch View</h1>
          <Switch defaultChecked onChange={handleTableSwitch} />
        </div>
        Total Products : {parseInt(productsCount)}
      </>
      <div style={{ paddingBottom: 40 }}>
        <AntTable
          products={data?.data}
          pageSize={limit}
          onChange={pageChangeHandler}
          current={pager}
          columns={orderColumns}
          total={parseInt(productsCount)}
          showLessItems
        />
      </div>
    </Template>
  );
};

const mapStateToProps = ({ USER, WOO_PRODUCTS }) => ({ USER, WOO_PRODUCTS });

export default connect(mapStateToProps)(Orders);
