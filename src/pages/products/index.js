import React, { useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ProductItem from "../../components/product-item/ProductItem";
import EditProductModal from "../../components/edit-modal/EditModal";
import { loading, storeWooProducts, deleteWooProudct, editWooProduct } from "../../store/actions/";
import API from "../../API/";
import Pagination from "rc-pagination";
import { store as notifStore } from "react-notifications-component";
import AntTable from "../../components/ant-table";
import { Space, Switch } from "antd";
import useColumnProducts from "./useProductsColumns";
import { useQuery } from "react-query";
import Template from "../../components/common/template";
import useProducts from "./hooks/useProducts";

const Products = ({ dispatch, USER, WOO_PRODUCTS }) => {
  const [pager, setPager] = useState(1);
  const [switchPreview, setSwichPreview] = useState(true);
  const [limit, setLimit] = useState(10);

  const columns = useColumnProducts();
  const { isLoading, isFetching, error, data } = useProducts(USER, limit, pager);

  const wooProducts = data?.data;
  const productsCount = data?.headers["x-wp-total"];
  console.log(data);
  const renderProducts = () => {
    return wooProducts.map((product, i) => (
      <ProductItem
        key={i}
        liveUrl={API.APP_API_URL}
        data={product}
        deleteFunc={(id) => deleteProduct(id)}
        openModalEdit={(data) => dispatch(editWooProduct(true, data))}
      />
    ));
  };

  const renderProductsContainer = () => {
    return (
      <ul id="products-list" className={wooProducts.length < 3 ? "few-products" : ""}>
        {renderProducts()}
      </ul>
    );
  };

  const pageChangeHandler = (pg, pageSize) => {
    setPager(pg);
    setLimit(pageSize);
  };

  const handleTableSwitch = () => {
    setSwichPreview(!switchPreview);
  };

  const deleteProduct = (productId) => {
    dispatch(loading(true, "header-loading"));
    API.WC_deleteProduct(USER.token, productId)
      .then((data) => {
        dispatch(deleteWooProudct(data.id));
        dispatch(loading(false, "header-loading"));
        notifStore.addNotification({
          title: "Success",
          message: "The product has been deleted.",
          type: "success",
          container: "top-right",
          width: 400,
          dismiss: {
            duration: 2000,
            onScreen: true,
          },
        });
      })
      .catch((error) => {
        notifStore.addNotification({
          title: "Error!",
          message: "Network error please try again !",
          type: "danger",
          container: "top-center",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });

        // HIDE LOADING
        dispatch(loading(false, "header-loading"));
      });
    // handleClose()
  };

  return (
    <div id="user-products-page">
      <Template isLoading={isLoading} error={error} isFetching={isFetching}>
        {/* handleTableSwitch */}
        <div className="flex justify-between">
          <div className="flex">
            <h1>Switch View</h1>
            <Switch defaultChecked onChange={handleTableSwitch} />
          </div>
          <>Total Products : {parseInt(productsCount)}</>
        </div>

        {switchPreview ? (
          <div style={{ paddingBottom: 40 }}>
            <AntTable
              products={wooProducts}
              pageSize={limit}
              onChange={pageChangeHandler}
              current={pager}
              columns={columns}
              total={parseInt(productsCount)}
              showLessItems
            />
          </div>
        ) : (
          <div id="container">
            {wooProducts.length > 0 ? renderProductsContainer() : null}

            {productsCount > 0 ? (
              <Pagination
                pageSize={columns}
                onChange={pageChangeHandler}
                current={pager}
                total={parseInt(productsCount)}
                showLessItems
                locale={{
                  prev_page: "PREV_PAGE",
                  next_page: "NEXT_PAGE",
                  prev_5: "PREV_5_PAGES",
                  next_5: "NEXT_5_PAGES",
                  prev_3: "PREV_3_PAGES",
                  next_3: "NEXT_3_PAGES",
                }}
              />
            ) : null}
          </div>
        )}
        <EditProductModal />
      </Template>
    </div>
  );
};

const mapStateToProps = ({ USER, WOO_PRODUCTS }) => ({ USER, WOO_PRODUCTS });

export default connect(mapStateToProps)(Products);
