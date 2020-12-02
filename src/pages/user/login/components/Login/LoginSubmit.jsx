import { Button, Form } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';
const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (
    <>
      {/* <FormItem style={{ marginBottom: 0 }}>
        <a style={{ float: 'right' }} href="/function/account?tab=2">
          忘记密码?
        </a>
      </FormItem> */}
      <FormItem>
        <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
      </FormItem>
    </>
  );
};

export default LoginSubmit;
