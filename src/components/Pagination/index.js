import React from 'react';
import { Pagination } from 'antd';

function PaginationWrap({ totalPages, page, onChange }) {
  return <Pagination defaultCurrent={page} total={totalPages} onChange={onChange} />;
}

export default PaginationWrap;
