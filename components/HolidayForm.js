/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { DatePicker, Form, Input, InputNumber, Button, Select } from 'antd';
import fetch from 'isomorphic-unfetch';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class HolidayForm extends React.Component {
  state = {
    categories: [],
  };

  async componentDidMount() {
    const res = await fetch('http://localhost:3000/db/categories');
    const categories = await res.json();
    this.setState({ categories });
  }

  addHolidayToDB = data => {
    fetch('http://localhost:3000/db/holidays', {
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
    let numHours = 0;
    if (fromDate !== undefined && toDate !== undefined) {
      if (fromDate === toDate) {
        numHours = 8;
      } else {
        numHours = toDate.diff(fromDate, 'days') * 8 + 8;
      }
    }
    this.props.form.setFieldsValue({
      duration: numHours,
    });
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
        console.log(payload);
      }
    });
  };

  render() {
    const { categories } = this.state;
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
            {getFieldDecorator('duration')(<InputNumber min={0.5} step={0.5} />)}
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
