import React, { useState } from 'react';
import Router from 'next/router';
// import { Form, Input, InputNumber, Button, Select } from 'antd';
import fetch from 'isomorphic-unfetch';
import { serverAddr } from '../config';

const Configuration = ({ entitlement }) => {
  const [baseLeave, setBaseLeave] = useState(entitlement.base);
  const [carriedLeave, setCarriedLeave] = useState(entitlement.carried);

  const updateEntitlement = data => {
    const { year } = data;
    fetch(`${serverAddr}/db/entitlement/${year}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {};
    payload.year = entitlement.year;
    payload.base = baseLeave;
    payload.carried = carriedLeave;
    updateEntitlement(payload);
  };

  return (
    <div className="container">
      <header className="layout-header">
        Configuration Page for leave year: {entitlement.year}
      </header>
      <form className="config-form" onSubmit={handleSubmit}>
        <label htmlFor="baseLeave" className="config-label">
          Base Entitlement (hours):
          <input
            className="config-input"
            value={baseLeave}
            onChange={e => setBaseLeave(parseInt(e.target.value, 10))}
            type="number"
            step="4"
            name="baseLeave"
            id="baseLeave"
            required
          />
        </label>
        <br />
        <label htmlFor="carriedLeave" className="config-label">
          Carried Over (hours):
          <input
            className="config-input"
            value={carriedLeave}
            onChange={e => setCarriedLeave(parseInt(e.target.value, 10))}
            type="number"
            step="4"
            name="carriedLeave"
            id="carriedLeave"
            required
          />
        </label>
        <br />
        <button className="button-primary" type="submit">
          Submit
        </button>
        <button className="button-primary" type="button" onClick={() => Router.push('/')}>
          Back
        </button>
      </form>
      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          background: #f0f2f5;
        }

        .config-form {
          margin-top: 20px;
          width: 400px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .config-label {
          font-size: 16px;
          text-align: right;
        }

        .config-input {
          margin: 5px;
          box-sizing: border-box;
          display: inline-block;
          height: 32px;
          padding: 4px 11px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          line-height: 32px;
          background-color: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          transition: all 0.3s;
          margin-left: 20px;
        }

        .input::selection {
          color: #fff;
          background: #1890ff;
        }

        .button-primary {
          margin: 5px;
          line-height: 1.499;
          display: inline-block;
          font-weight: 400;
          white-space: nowrap;
          text-align: center;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          user-select: none;
          touch-action: manipulation;
          height: 32px;
          padding: 0 15px;
          font-size: 14px;
          border-radius: 4px;
          color: #fff;
          background-color: #1890ff;
          border-color: #1890ff;
          text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }

        .layout-header {
          height: 64px;
          padding: 0 50px;
          line-height: 64px;
          background: #001529;
          display: block;
          color: #fff;
          font-size: 1.5em;
        }
      `}</style>
      <style jsx global>{`
        body {
          background-color: #f0f2f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        }
      `}</style>
    </div>
  );
};

Configuration.getInitialProps = async ({ query }) => {
  const leaveYearDB = query.year;
  const entitlementRes = await fetch(`${serverAddr}/db/entitlement/${leaveYearDB}`);
  const entitlement = await entitlementRes.json();
  return { entitlement };
};

export default Configuration;
