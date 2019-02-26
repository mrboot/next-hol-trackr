import React from 'react';
import { Divider } from 'antd';
import HolidayTable from '../components/HolidayTable';
import HolidayForm from '../components/HolidayForm';

export default () => (
  <div style={{ marginTop: 50, marginLeft: 50, marginRight: 50 }}>
    <HolidayTable />
    <Divider>Add New Holiday</Divider>
    <HolidayForm />
  </div>
);
