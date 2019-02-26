/* eslint-disable react/react-in-jsx-scope */
import { Table, Tag, Button } from 'antd';

const deleteHoliday = holID => {
  fetch(`http://localhost:3000/db/holiday/${holID}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  }).then(res => {
    // res.status === 200 ? this.setState({ updated: true }) : '';
  });
};

const handleClick = holID => {
  deleteHoliday(holID);
  // this.setUpdated;
  // this.props.dbAltered();
  // console.log(item);
};

const colours = {
  Holiday: 'green',
  Entitlement: 'gold',
  'TOIL (taken)': 'geekblue',
  'TOIL (earned)': 'purple',
};

const columns = [
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Start Date',
    dataIndex: 'fromDate',
  },
  {
    title: 'End Date',
    dataIndex: 'toDate',
  },
  {
    title: 'Category',
    key: 'category',
    dataIndex: 'category',
    render: category => (
      <span>
        <Tag color={colours[category]}>{category.toUpperCase()}</Tag>
      </span>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
  },
  {
    title: '',
    render: () => (
      <span>
        <Button type="danger" icon="close-circle" onClick={handleClick}>
          Delete
        </Button>
      </span>
    ),
  },
];

const HolidayTable = ({ holidays }) => (
  <div style={{ marginLeft: 50, marginRight: 50 }}>
    <Table columns={columns} dataSource={holidays} rowKey={record => record._id} />
  </div>
);

export default HolidayTable;
