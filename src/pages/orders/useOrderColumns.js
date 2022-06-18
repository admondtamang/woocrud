import { Tag } from "antd";
import React, { useMemo } from "react";

export default function useOrderColumns() {
  const orderColumns = useMemo(
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
        width: "40%",
        key: "billing",
        render: (_, { billing, shipping }) => {
          // display object in key value pair
          function renderObject(data, label = "") {
            return (
              <div>
                <h1 className="bold mt-2">{label}</h1>
                {Object.entries(data).map(([key, value]) => (
                  <div>{key + ":" + value}</div>
                ))}
              </div>
            );
          }

          return (
            <div className="flex" style={{ display: "flex", justifyContent: "space-between" }}>
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

  return orderColumns;
}
