import React from 'react';
import nodataImg from '../../../public/imgs/无数据.svg';

// eslint-disable-next-line no-unused-vars
function Nodata(props) {
  return (
    <>
      <div style={{ textAlign: 'center', padding: ' 20px ' }}>
        <img src={nodataImg} alt="" />
        <p style={{ marginTop: '20px' }}>暂无数据</p>
      </div>
    </>
  );
}

export default Nodata;
