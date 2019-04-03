/* eslint-disable react/react-in-jsx-scope */
import { Table, Tag, Button } from 'antd';
import moment from 'moment';
import { serverAddr } from '../config';

const HolidayTable = props => {
  const { categories, currentHolidays } = props;

  const deleteHoliday = holID => {
    fetch(`${serverAddr}/db/holiday/${holID}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });
  };

  const hoursToDays = hours => hours / 8;

  const displayDays = hours => {
    if (hours === 0) {
      return '';
    }
    const days = hoursToDays(hours);
    const word = days > 1 ? 'days' : 'day';
    return `${hours} hours (${days} ${word})`;
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

  const displayDates = holDate => {
    // console.log(moment(holDate));
    return moment(holDate).format('ddd Do MMM YYYY');
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Start Date',
      dataIndex: 'fromDate',
      render: fromDate => <span>{displayDates(fromDate)}</span>,
    },
    {
      title: 'End Date',
      dataIndex: 'toDate',
      render: toDate => <span>{displayDates(toDate)}</span>,
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
      render: duration => <span>{displayDays(duration)}</span>,
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
      <Table columns={columns} dataSource={currentHolidays} rowKey={record => record._id} />
    </div>
  );
};

export default HolidayTable;
