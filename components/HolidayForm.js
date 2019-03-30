/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { DatePicker, Form, Input, InputNumber, Button, Select } from 'antd';
import fetch from 'isomorphic-unfetch';
import twix from 'twix';
import moment from 'moment';
import { serverAddr } from '../config';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class HolidayForm extends React.Component {
  state = {
    bankHolidays: {},
  };

  async componentDidMount() {
    const endpoint = 'https://www.gov.uk/bank-holidays.json';
    const response = await fetch(endpoint);
    const data = await response.json();
    const england = data['england-and-wales'].events;
    const hols = england.filter(hol => {
      return this.isInTheFuture(hol.date);
    });
    this.setState({ bankHolidays: hols });
  }

  isWeekend = day => {
    return !!(day.isoWeekday() === 6 || day.isoWeekday() === 7);
  };

  isInTheFuture = date => {
    const today = moment(Date.now());
    return moment(date).isSameOrAfter(today);
  };

  isBankHoliday = day => {
    const { bankHolidays } = this.state;
    const match = bankHolidays.filter(hol => {
      return hol.date === day.format('YYYY-MM-DD');
    });
    return match.length > 0;
  };

  addHolidayToDB = data => {
    fetch(`${serverAddr}/db/holidays`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  onChangeDates = dateRange => {
    const fromDate = dateRange[0];
    const toDate = dateRange[1];
    const holType = this.props.form.getFieldValue('category');
    if (fromDate !== undefined && toDate !== undefined) {
      const selectedDays = fromDate.twix(toDate).toArray('days');
      const weekdays = selectedDays
        .filter(day => !this.isWeekend(day))
        .filter(day => !this.isBankHoliday(day));
      const numHours = holType === 'TOIL (earned)' ? selectedDays.length * 8 : weekdays.length * 8;
      this.props.form.setFieldsValue({ duration: numHours });
    } else {
      this.props.form.resetFields('duration');
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const rangeValue = fieldsValue['range-picker'];
        const fromDate = rangeValue[0].format('YYYY-MM-DD');
        const toDate = rangeValue[1].format('YYYY-MM-DD');
        const payload = {};
        payload.description = fieldsValue.description;
        payload.category = fieldsValue.category;
        payload.fromDate = fromDate;
        payload.toDate = toDate;
        payload.duration = fieldsValue.duration;
        this.addHolidayToDB(payload);
        this.props.onAddRefresh();
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { categories } = this.props;
    const optionItems = categories.map(category => (
      <Option key={category._id} value={category.name}>
        {category.name}
      </Option>
    ));
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select dates!' }],
    };
    return (
      <div style={{ marginLeft: 50, marginRight: 50 }}>
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <FormItem label="Holiday description:" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please enter a description!' }],
            })(<Input placeholder="Enter description" />)}
          </FormItem>
          <FormItem label="Type of holiday:" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
            {getFieldDecorator('category', {
              initialValue: 'Holiday',
              rules: [{ required: true, message: 'Please pick a category!' }],
            })(<Select style={{ width: 192 }}>{optionItems}</Select>)}
          </FormItem>
          <FormItem label="Select Dates:" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('range-picker', rangeConfig)(
              <RangePicker format="DD/MM/YYYY" onChange={this.onChangeDates} />
            )}
          </FormItem>
          <FormItem label="Duration:" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator('duration')(<InputNumber step={0.5} />)}
          </FormItem>
          <FormItem wrapperCol={{ span: 8, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedHolidayForm = Form.create({ name: 'holiday_form' })(HolidayForm);

export default WrappedHolidayForm;
