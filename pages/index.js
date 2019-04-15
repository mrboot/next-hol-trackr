/* eslint-disable func-names */
import React from 'react';
import { Divider, Button, Icon, Layout } from 'antd';
import fetch from 'isomorphic-unfetch';
import moment from 'moment';
import { serverAddr } from '../config';

import HolidayTable from '../components/HolidayTable';
import HolidayForm from '../components/HolidayForm';

const { Header, Content } = Layout;

class Index extends React.Component {
  state = {
    holidays: this.props.holidays,
    categories: this.props.categories,
    leaveYearStart: this.props.leaveYearStart,
    leaveYearEnd: this.props.leaveYearEnd,
    leaveYearDisplay: this.props.leaveYearDisplay,
    updated: false,
  };

  static getInitialProps = async function() {
    const holRes = await fetch(`${serverAddr}/db/holidays`);
    const holidays = await holRes.json();
    const catRes = await fetch(`${serverAddr}/db/categories`);
    const categories = await catRes.json();
    const { leaveYearStart, leaveYearEnd, leaveYearDisplay } = this.getLeaveYear();
    return { holidays, categories, leaveYearStart, leaveYearEnd, leaveYearDisplay };
  };

  async componentDidUpdate() {
    const { updated } = this.state;
    if (updated) {
      this.refreshTable();
    }
  }

  static getLeaveYear() {
    const now = moment();
    const currentYear = now.year();

    if (now.isBefore(moment(`${currentYear}-04-01`))) {
      const leaveYearStart = moment(`${currentYear - 1}-04-01`);
      const leaveYearEnd = moment(`${currentYear}-03-31`);
      const leaveYearDisplay = `${currentYear - 1} / ${currentYear}`;
      return { leaveYearStart, leaveYearEnd, leaveYearDisplay };
    }
    const leaveYearStart = moment(`${currentYear}-04-01`);
    const leaveYearEnd = moment(`${currentYear + 1}-03-31`);
    const leaveYearDisplay = `${currentYear} / ${currentYear + 1}`;
    return { leaveYearStart, leaveYearEnd, leaveYearDisplay };
  }

  getNextLeaveYear = () => {
    const { leaveYearStart, leaveYearEnd } = this.state;
    const nextLeaveYearStart = moment(leaveYearStart).add(1, 'y');
    const nextLeaveYearEnd = moment(leaveYearEnd).add(1, 'y');
    const nextLeaveYearDisplay = `${nextLeaveYearStart.year()} / ${nextLeaveYearEnd.year()}`;
    this.setState({
      leaveYearStart: nextLeaveYearStart,
      leaveYearEnd: nextLeaveYearEnd,
      leaveYearDisplay: nextLeaveYearDisplay,
    });
  };

  getPreviousLeaveYear = () => {
    const { leaveYearStart, leaveYearEnd } = this.state;
    const prevLeaveYearStart = moment(leaveYearStart).subtract(1, 'y');
    const prevLeaveYearEnd = moment(leaveYearEnd).subtract(1, 'y');
    const prevLeaveYearDisplay = `${prevLeaveYearStart.year()} / ${prevLeaveYearEnd.year()}`;
    this.setState({
      leaveYearStart: prevLeaveYearStart,
      leaveYearEnd: prevLeaveYearEnd,
      leaveYearDisplay: prevLeaveYearDisplay,
    });
  };

  getCurrentEarned = holidays => {
    const balance = holidays.reduce((bal, holiday) => {
      return holiday.category === 'TOIL (earned)' ? bal + holiday.duration : bal;
    }, 0);
    return balance;
  };

  getCurrentTaken = holidays => {
    const balance = holidays.reduce((bal, holiday) => {
      return holiday.category !== 'TOIL (earned)' ? bal + holiday.duration : bal;
    }, 0);
    return balance;
  };

  hoursToDays = hours => hours / 8;

  displayDays = hours => {
    if (hours === 0) {
      return '';
    }
    const days = this.hoursToDays(hours);
    const word = days > 1 ? 'days' : 'day';
    return `${hours} hours (${days} ${word})`;
  };

  refreshTable = async () => {
    const res = await fetch(`${serverAddr}/db/holidays`);
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
    const { holidays, categories, leaveYearStart, leaveYearEnd, leaveYearDisplay } = this.state;
    // const { leaveYearStart, leaveYearEnd, leaveYearDisplay } = this.getLeaveYear();
    const currentHolidays = holidays.filter(holiday => {
      return (
        moment(holiday.fromDate).isAfter(leaveYearStart) &&
        moment(holiday.toDate).isBefore(leaveYearEnd)
      );
    });
    const entitlement = 200;
    const earned = this.getCurrentEarned(currentHolidays);
    const taken = this.getCurrentTaken(currentHolidays);
    const balance = entitlement + earned - taken;

    return (
      <Layout>
        <Header>
          <Button type="primary" onClick={this.getPreviousLeaveYear}>
            <Icon type="left" />
            Previous Year
          </Button>
          <span
            style={{ fontSize: '1.5em', color: 'white', marginLeft: 10, marginRight: 10 }}
          >{`Current Leave Year: ${leaveYearDisplay}`}</span>
          <Button type="primary" onClick={this.getNextLeaveYear}>
            Next Year
            <Icon type="right" />
          </Button>
        </Header>
        <Content>
          <div>
            <p
              style={{
                fontSize: '1.5em',
                marginLeft: 50,
                marginRight: 50,
                marginTop: 10,
              }}
            >
              {`Entitlement: ${this.displayDays(entitlement)}, 
              Earned: ${this.displayDays(earned)}, 
              Taken: ${this.displayDays(taken)}, 
              Remaining: ${this.displayDays(balance)}`}
            </p>
          </div>
          <HolidayTable
            currentHolidays={currentHolidays}
            categories={categories}
            dbAltered={this.toggleUpdated}
          />
          <Divider>Add New Holiday</Divider>
          <HolidayForm categories={categories} onAddRefresh={this.toggleUpdated} />
        </Content>
      </Layout>
    );
  }
}

export default Index;
