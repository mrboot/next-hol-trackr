/* eslint-disable react/react-in-jsx-scope */
import { Table, Tag, Button } from 'antd';
import { serverAddr } from '../config';

const HolidayTable = props => {
  const { categories, holidays } = props;

  const deleteHoliday = holID => {
    fetch(`${serverAddr}/db/holiday/${holID}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });
  };

  const handleClick = holID => {
    deleteHoliday(holID);
    props.dbAltered();
  };

  const colours = {};
  categories.map(category => {
    colours[category.name] = category.colour;
    return colours;
  });

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
      render: record => (
        <span>
          <Button type="danger" icon="close-circle" onClick={() => handleClick(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ marginLeft: 50, marginRight: 50 }}>
      <Table columns={columns} dataSource={holidays} rowKey={record => record._id} />
    </div>
  );
};

export default HolidayTable;
