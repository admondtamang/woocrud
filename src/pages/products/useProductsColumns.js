import { Space } from "antd";
import { Tag } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { APP_PATHS } from "../../config";

export default function useColumnProducts() {
  return useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        key: "images",
        width: "10%",
        render: (_, record) => {
          const image = record?.images[0]?.src;
          if (image) return <img className="visual" src={image} alt={record.slug} />;
          else
            return (
              <div className="no-thumbnail">
                <span>No Image</span>
              </div>
            );
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
      },
      {
        title: "Stock_quantity",
        dataIndex: "stock_quantity",
        key: "stock_quantity",
        sorter: (a, b) => a.stock_quantity - b.stock_quantity,
      },
      {
        title: "status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.stock_quantity - b.stock_quantity,
        render: (_, { stock_status }) => {
          let color;
          if (stock_status === "publish") color = "green";
          else color = "geekblue";

          return (
            <Tag color={color} key={stock_status}>
              {stock_status.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "stock_status",
        dataIndex: "stock_status",
        key: "stock_status",
        sorter: (a, b) => a.stock_status.length - b.stock_status.length,
        render: (_, { stock_status }) => {
          let color;
          if (stock_status === "instock") color = "green";
          else color = "red";

          return (
            <Tag color={color} key={stock_status}>
              {stock_status.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "price",
        dataIndex: "price",
        key: "price",
        sorter: (a, b) => a.price - b.price,
        render: (_, { price, regular_price }) => (
          <>
            <strong>{price}</strong> <strike> {regular_price}</strike>
          </>
        ),
      },

      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Link to={APP_PATHS.EDIT_PRODUCT.replace(":productId", record.id)}> Edit</Link>
            {/* <a id="product-item-delete-button" onClick={() => setShowConfirmation(true)} className="danger">
              Delete Product
            </a> */}
          </Space>
        ),
      },
    ],
    []
  );
}
