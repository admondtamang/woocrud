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
import { Link } from "react-router-dom";
import { APP_PATHS } from "../../config";
import { Tag } from "antd";

const DEFAULT_PER_PAGE = 18;

const Orders = ({ dispatch, USER, WOO_PRODUCTS }) => {
  const [productsCount, setProductsCount] = useState(0);
  const [pager, setPager] = useState(1);
  const [wooProducts, setWooProducts] = useState([]);
  const [switchPreview, setSwichPreview] = useState(true);

  useEffect(() => {
    if (!("products" in WOO_PRODUCTS)) {
      dispatch(loading(true, "header-loader"));
      getWooProducts();
    }
  }, []);

  useEffect(() => {
    if (productsCount > 0 && pager !== WOO_PRODUCTS.selectedPage) {
      getWooProducts(pager);
    }
  }, [pager]);

  useEffect(() => {
    if ("products" in WOO_PRODUCTS && WOO_PRODUCTS.products.length > 0) {
      setWooProducts(WOO_PRODUCTS.products);
      setProductsCount(WOO_PRODUCTS.productsCount);
      setPager(WOO_PRODUCTS.selectedPage);
    }
  }, [WOO_PRODUCTS]);

  const getWooProducts = () => {
    dispatch(loading(true, "header-loader"));
    API.WC_getWooOrders(USER.token, DEFAULT_PER_PAGE, pager)
      .then((result) => {
        if (result !== undefined) {
          dispatch(
            storeWooProducts({
              products: result.data,
              productsCount: result.headers["x-wp-total"],
              selectedPage: pager,
            })
          );
          // HIDE LOADER
          dispatch(loading(false, "header-loader"));
        }
      })
      .catch((error) => {
        dispatch({
          type: "ERROR",
          payload: error,
        });
        // HIDE LOADING
        dispatch(loading(false, "header-loader"));
      });
  };

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

  const columns = useMemo(
    () => [
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        sorter: (a, b) => a.total - b.total,
        render: (_, { total, shipping_total }) => (
          <>
            <strong>{total}</strong> <>shipping {shipping_total}</>
          </>
        ),
      },
      {
        title: "billing",
        dataIndex: "billing",
        key: "billing",
        render: (_, { billing, shipping }) => {
          // display object in key value pair
          function renderObject(data, label = "") {
            return (
              <>
                <h1 className="bold mt-2">{label}</h1>
                {Object.entries(data).map(([key, value]) => (
                  <div>{key + ":" + value}</div>
                ))}
              </>
            );
          }

          return (
            <div className="flex">
              {renderObject(billing, "Billing")}
              {renderObject(shipping, "Shipping")}
            </div>
          );
        },
      },

      {
        title: "status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.stock_quantity - b.stock_quantity,
        render: (_, { status }) => {
          let color;
          if (status === "COMPLETED") color = "green";
          if (status === "ON-HOLD") color = "red";
          else color = "geekblue";

          return (
            <Tag color={color} key={status}>
              {status?.toUpperCase()}
            </Tag>
          );
        },
      },
    ],
    []
  );

  return (
    <div id="user-products-page">
      <Header />
      {/* handleTableSwitch */}
      <>
        <div>
          <h1>Switch View</h1>
          <Switch defaultChecked onChange={handleTableSwitch} />
        </div>
        Total Products : {parseInt(productsCount)}
      </>
      {switchPreview ? (
        <div style={{ paddingBottom: 40 }}>
          <AntTable
            products={wooProducts}
            pageSize={DEFAULT_PER_PAGE}
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
              pageSize={DEFAULT_PER_PAGE}
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
      <Footer />
    </div>
  );
};

const mapStateToProps = ({ USER, WOO_PRODUCTS }) => ({ USER, WOO_PRODUCTS });

export default connect(mapStateToProps)(Orders);
