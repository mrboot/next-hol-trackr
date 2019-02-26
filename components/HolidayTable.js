/* eslint-disable react/react-in-jsx-scope */
import { Table, Tag, Button } from 'antd';

const colours = {
  holiday: 'green',
  entitlement: 'gold',
  'TOIL (taken)': 'geekblue',
  'TOIL (earned)': 'purple',
};

const columns = [
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Start Date',
    dataIndex: 'start',
    key: 'start',
  },
  {
    title: 'End Date',
    dataIndex: 'end',
    key: 'end',
  },
  {
    title: 'Category',
    key: 'category',
    dataIndex: 'category',
    render: category => (
      <span>
        <Tag color={colours[category]} key={category}>
          {category.toUpperCase()}
        </Tag>
      </span>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '',
    key: 'action',
    render: () => (
      <span>
        <Button type="danger" icon="close-circle">
          Delete
        </Button>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    description: 'Opening balance',
    start: '2018-04-01',
    end: '',
    category: 'entitlement',
    duration: '+200',
  },
  {
    key: '2',
    description: 'Wales trip',
    start: '2018-04-09',
    end: '2018-04-13',
    category: 'holiday',
    duration: '-40',
  },
  {
    key: '3',
    description: 'Friday off (Solo)',
    start: '2018-06-08',
    end: '2018-06-08',
    category: 'holiday',
    duration: '-8',
  },
  {
    key: '4',
    description: 'Onsite UAT Ohio (outbound Sunday)',
    start: '2018-09-24',
    end: '2018-09-24',
    category: 'TOIL (earned)',
    duration: '+8',
  },
  {
    key: '5',
    description: 'Christmas hols',
    start: '2018-12-31',
    end: '2018-12-31',
    category: 'TOIL (taken)',
    duration: '-8',
  },
];

const HolidayTable = () => (
  <div style={{ marginLeft: 50, marginRight: 50 }}>
    <Table columns={columns} dataSource={data} />
  </div>
);

export default HolidayTable;
