import { Table } from 'antd';

const CustomTable = ({ columns, data, loading, pagination }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      bordered
      scroll={{ x: true }}
    />
  );
};

export default CustomTable;