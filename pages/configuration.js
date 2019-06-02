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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="baseLeave">Base Entitlement:</label>
        <input
          value={baseLeave}
          onChange={e => setBaseLeave(parseInt(e.target.value, 10))}
          type="number"
          step="4"
          name="baseLeave"
          id="baseLeave"
          required
        />
        <br />
        <label htmlFor="carriedLeave">Carried Over:</label>
        <input
          value={carriedLeave}
          onChange={e => setCarriedLeave(parseInt(e.target.value, 10))}
          type="number"
          step="4"
          name="carriedLeave"
          id="carriedLeave"
          required
        />
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => Router.push('/')}>
          Back
        </button>
      </form>
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
