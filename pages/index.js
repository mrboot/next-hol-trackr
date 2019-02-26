/* eslint-disable func-names */
import React from 'react';
import { Divider } from 'antd';
import fetch from 'isomorphic-unfetch';

import HolidayTable from '../components/HolidayTable';
import HolidayForm from '../components/HolidayForm';

class Index extends React.Component {
  state = {
    holidays: this.props.holidays,
    updated: false,
  };

  static getInitialProps = async function() {
    const res = await fetch('http://localhost:3000/db/holidays');
    const holidays = await res.json();
    return { holidays };
  };

  async componentDidUpdate() {
    const { updated } = this.state;
    if (updated) {
      this.refreshTable();
    }
  }

  refreshTable = async () => {
    const res = await fetch('http://localhost:3000/db/holidays');
    const holidays = await res.json();
    this.setState({ holidays, updated: false });
  };

  toggleUpdated = () => {
    this.state.updated ? this.setState({ updated: false }) : this.setState({ updated: true });
  };

  setUpdated = () => {
    this.setState({ updated: true });
  };

  render() {
    const { holidays } = this.state;
    return (
      <div style={{ marginTop: 50, marginLeft: 50, marginRight: 50 }}>
        <HolidayTable holidays={holidays} dbAltered={this.toggleUpdated} />
        <Divider>Add New Holiday</Divider>
        <HolidayForm onAddRefresh={this.toggleUpdated} />
      </div>
    );
  }
}

export default Index;
