import { ArrowLeftOutlined, InboxOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Form, message, Upload, Tooltip } from 'antd';
import { connect, history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { fileUpload } from '@/services/common';
import { media } from '@/utils/utils';

const FormItem = Form.Item;

const Edit = (props) => {
  const { id } = props.location.query;
  const [docPaths, setDocPaths] = useState([]);
  const [fileList, setFileList] = useState([]);

  const { submitting } = props;
  const [error, setError] = useState([]);
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 2,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const formEditorLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 2,
      },
    },
    wrapperCol: {
      span: 24,
    },
  };

  useEffect(() => {
    if (id) {
      getInfo();
    }
  }, []);

  const getInfo = () => {
    const { dispatch } = props;
    dispatch({
      type: 'educationalAndCurriculum/getInfo',
      payload: { classId: id },
      callback: (res) => {
        res.description = BraftEditor.createEditorState(res.description);
        res.condition = BraftEditor.createEditorState(res.condition);
        res.equipment = BraftEditor.createEditorState(res.equipment);
        const fileList = res.filePaths?.map((item) => {
          let obj = {};
          item = item ? decodeURIComponent(item) : '';
          obj.name = item?.match(/_(\S*)\?/)[1] || item;
          obj.url = item;
          obj.uid = '-2';
          obj.status = 'done';
          return obj;
        });
        setFileList(fileList);
        form.setFieldsValue(res);
      },
    });
  };

  const onFinish = (values) => {
    const { dispatch } = props;
    values.docPaths = docPaths;
    values.description = values.description ? values.description.toHTML() : '';
    values.condition = values.condition ? values.condition.toHTML() : '';
    values.equipment = values.equipment ? values.equipment.toHTML() : '';
    if (id) {
      values.id = id;
    }
    dispatch({
      type: 'educationalAndCurriculum/create',
      payload: values,
      callback: (res) => {
        if (res) {
          message.success(`${id ? '修改' : '新增'}成功`);
          history.goBack();
        }
      },
    });
  };

  const handleBeforeUpload = async (file, fileList) => {
    const formData = new FormData();
    formData.append('file', file);
    const hide = message.loading('文件上传中,请耐心等待...');
    const res = await fileUpload(formData);
    if (res) {
      setDocPaths([res.name]);
      fileList = fileList.map((item) => {
        item.url = res.url;
        return item;
      });
      setFileList(fileList);
      hide();
      message.success('文件上传成功');
    } else {
      hide();
      message.error('文件上传失败');
    }

    return false;
  };

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }
    return (
      <span className="errorIcon">
        <CloseCircleOutlined />
        {errorCount}
      </span>
    );
  };

  return (
    <Form
      // hideRequiredMark
      style={{
        marginTop: 8,
      }}
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer header={{ title: '' }}>
        <Card bordered={false}>
          <Tooltip title="注：一经确认无法修改">
            <FormItem
              {...formItemLayout}
              label="课程编号"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入课程编号',
                },
              ]}
            >
              <Input disabled={id} placeholder="请输入课程编号" />
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="课程名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入课程名称',
              },
            ]}
          >
            <Input placeholder="请输入课程名称" />
          </FormItem>

          <FormItem {...formEditorLayout} label="课程说明" name="description">
            <BraftEditor media={media()} placeholder="请输入课程说明" className="my-editor" />
          </FormItem>
          <FormItem {...formEditorLayout} label="授课条件" name="condition">
            <BraftEditor media={media()} placeholder="请输入授课条件" className="my-editor" />
          </FormItem>
          <FormItem {...formEditorLayout} label="课程器材" name="equipment">
            <BraftEditor media={media()} placeholder="请输入课程器材" className="my-editor" />
          </FormItem>

          <FormItem {...formEditorLayout} label="课程附件">
            <Upload.Dragger fileList={fileList} action="#" beforeUpload={handleBeforeUpload}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽上传课程相关附件</p>
            </Upload.Dragger>
          </FormItem>
        </Card>
      </PageContainer>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button onClick={() => history.goBack()} icon={<ArrowLeftOutlined />}>
          返回
        </Button>

        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['educationalAndCurriculum/create'],
}))(Edit);
