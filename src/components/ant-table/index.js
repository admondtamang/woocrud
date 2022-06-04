import { Table } from "antd";
import React from "react";

export default function AntTable({ products, pageSize, current, total, columns, onChange }) {
  return (
    <div>
      <Table
        dataSource={products}
        columns={columns}
        pagination={{
          current: current,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ["2", "3", "10", "100"],
          // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: onChange,
          //   onShowSizeChange: this.handlePageSizeChange,
        }}
      />
    </div>
  );
}
