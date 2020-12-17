import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Select,
  Input,
  Form,
  Button,
  List,
  Card,
  Modal,
  Radio,
  DatePicker,
  message,
  Badge,
} from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import { LightFilter, ProFormDatePicker } from '@ant-design/pro-form';
import moment from 'moment';
import { history, connect } from 'umi';

import { getSiteAll } from '@/pages/Function/Place/service';
import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { getAllPatient, getList, getStatistics } from './service';
import { getCommonEnums } from '@/services/common';
import { getAllRole, getEmployeeFindByRole } from '@/pages/Function/Employee/service';
import { getAuth } from '@/utils/utils';

const layout = {
  labelCol: {
    span: 4,
  },
};

function buildColor() {
  return (
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
  );
}

/**
 *
 * @param {*} result
 * @param {*} dataType
 * @param {*} field 与title进行匹配的字段名称
 * @param {*} dotField 显示小圆点的字段名称
 */
function buildColumns(result, dataType, field, dotField) {
  // 用于设置 小圆点及其颜色
  let dots = [];
  result.arrangeClassVos?.forEach((item) => {
    item.arrangeClasses?.forEach((sub) => {
      dots.push(sub[dotField]);
    });
  });
  dots = [...new Set(dots)]; // 去重
  let dotsColors = dots.map((item) => {
    return {
      color: buildColor(),
      [dotField]: item,
    };
  });
  return result.columns?.map((item, index) => {
    let obj = {
      key: index,
      align: 'center',
      title: item,
    };
    if (item) {
      obj.render = (_, record) => {
        let returnData = '';
        record.arrangeClasses?.map((sub) => {
          if (item === sub[field]) {
            dotsColors.forEach((subItem) => {
              if (sub[dotField] === subItem[dotField]) {
                returnData = (
                  <>
                    <Badge className="site-badge" color={subItem.color} text={sub[dotField]} />
                    {(dataType === 3 || dataType === 4) && <div>老师：{sub.employeeName}</div>}
                    {dataType !== 3 && <div>患者：{sub.patientName}</div>}
                  </>
                );
              }
            });
          }
        });
        return returnData;
      };
    } else {
      obj.dataIndex = 'timeName';
      if (result.columns?.length > 6) {
        obj.width = 50;
        obj.fixed = 'left';
      }
    }
    return obj;
  });
}

const CourseScheduling = ({ submitting, dispatch }) => {
  const auth = getAuth();
  const [form] = Form.useForm();
  const [showClassTop, setShowClassTop] = useState(false);
  const [list, setList] = useState([]);
  let [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const actionRef = useRef();
  const [query, setQuery] = useState({
    dataType: 1,
    date: moment().valueOf(),
    keywords: '',
    classId: null,
  });
  const [visible, setVisible] = useState(false);

  const [allRoleList, setAllRoleList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const [allPatientList, setAllPatientList] = useState([]);

  const [timeList, setTimeList] = useState([]);
  const [allSiteList, setAllSiteList] = useState([]);
  const [allClassList, setAllClassList] = useState([]);
  const [columns, setColumns] = useState();

  const onLoadMore = () => {
    setPage((page) => page + 1);
  };

  const loadMore = total >= page * 5 && (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button size="small" onClick={onLoadMore}>
        查看更多
      </Button>
    </div>
  );

  const optionsWithTab = [
    { label: '概览界面', value: 1 },
    { label: '评估师界面', value: 2 },
    { label: '患者界面', value: 3 },
    { label: '教室界面', value: 4 },
  ];
  const onOptionsWithTabChange = (e) => {
    const dataType = e.target.value;
    setQuery({
      ...query,
      dataType,
    });
  };
  const queryStatistics = async () => {
    const res = await getStatistics({
      page,
      size: 5,
    });
    if (res) {
      const data = list.concat(res.data);
      setList(data);
      setTotal(res.total);
    }
  };

  // 角色
  const queryAllRole = async () => {
    const res = await getAllRole();
    if (res) {
      setAllRoleList(res);
    }
  };
  // 患者
  const queryAllPatient = async () => {
    const res = await getAllPatient();
    if (res) {
      setAllPatientList(res);
    }
  };

  // 时间段
  const queryTimeList = async () => {
    const res = await getCommonEnums({
      enumName: 'ClassTimeType',
    });
    if (res) {
      setTimeList(Object.values(res).sort((a, b) => a.ordianl - b.ordianl));
    }
  };

  // 课程
  const queryAllClass = async () => {
    const res = await getAllClass();
    if (res) {
      res.map((item) => {
        item.label = item.name;
        item.key = item.id;
        return item;
      });
      setAllClassList(res);
    }
  };
  // 场地
  const querySiteAll = async () => {
    const res = await getSiteAll();
    if (res) {
      setAllSiteList(res);
    }
  };

  const handleRoleChange = async (roleId) => {
    const res = await getEmployeeFindByRole({ roleId });
    if (res) {
      setTeacherList(res);
    }
  };

  const queryList = async (params) => {
    const res = await getList({
      ...params,
    });

    if (res) {
      const fieldObj = {
        1: ['className', 'employeeName'],
        2: ['employeeName', 'className'],
        3: ['patientName', 'className'],
        4: ['siteName', 'className'],
      };
      setColumns(
        buildColumns(res, query.dataType, fieldObj[query.dataType][0], fieldObj[query.dataType][1]),
      );
      return Promise.resolve({
        data: res.arrangeClassVos,
      });
    }
  };

  useEffect(() => {
    queryAllRole();
    queryTimeList();
    queryAllPatient();
    querySiteAll();
    queryAllClass();
  }, []);
  useEffect(() => {
    queryStatistics();
  }, [page]);

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    await form.validateFields();
    let values = form.getFieldsValue();
    values.date = moment(values.date).valueOf();
    dispatch({
      type: 'educationalAndCourseScheduling/create',
      payload: values,
      callback: (res) => {
        if (res) {
          message.success('操作成功');
          handleCancel();
        }
      },
    });
  };

  return (
    <PageContainer
      extra={[
        auth?.canEdit && (
          <Button key="1" type="primary" onClick={() => setVisible(true)}>
            新增排课
          </Button>
        ),
      ]}
    >
      <Card>
        <Row>
          <Col style={{ textAlign: 'center' }} span={4}>
            <div>
              <Button
                onClick={() => history.push('/patriarch/childrenrecord')}
                style={{ width: 120 }}
              >
                患者管理
              </Button>
            </div>
            <div style={{ margin: '20px 0' }}>
              <Button style={{ width: 120 }}>治疗师管理</Button>
            </div>
            <div>
              <Button onClick={() => setShowClassTop(!showClassTop)} style={{ width: 120 }}>
                上课统计
              </Button>
            </div>
            {showClassTop && (
              <List
                style={{ marginTop: 30, background: '#F2F3F7' }}
                bordered
                header="本月上课量排行榜"
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                renderItem={(item) => (
                  <List.Item>
                    <span>
                      {item.sort}.{item.employeeName}
                    </span>
                    <span>{item.count}节</span>
                  </List.Item>
                )}
              />
            )}
          </Col>
          <Col span={20}>
            <Row>
              <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Radio.Group
                  style={{ marginLeft: '10%' }}
                  options={optionsWithTab}
                  onChange={onOptionsWithTabChange}
                  value={query.dataType}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Col>
            </Row>
            <ProTable
              scroll={{ x: columns?.length > 6 ? 2000 : 0 }}
              bordered
              columns={columns}
              actionRef={actionRef}
              params={query} // query中只要有一项变化就会执行queryList
              request={queryList}
              rowKey="id"
              search={false}
              pagination={false}
              toolbar={{
                search: {
                  allowClear: true,
                  placeholder: '请输入治疗师/患者姓名',
                  style: { width: '250px' },
                  onSearch: (keywords) => {
                    setQuery({
                      ...query,
                      keywords,
                    });
                  },
                },
                filter: (
                  <LightFilter
                    initialValues={{
                      date: moment(),
                    }}
                    onFinish={({ date }) => {
                      setQuery({
                        ...query,
                        date: moment(date).valueOf(),
                      });
                    }}
                  >
                    <ProFormDatePicker name="date" />
                  </LightFilter>
                ),
                menu: {
                  type: 'dropdown',
                  items: [
                    {
                      label: '全部课程',
                      key: '0',
                    },
                    ...allClassList,
                  ],
                  onChange: (id) => {
                    setQuery({
                      ...query,
                      classId: id == 0 ? null : id,
                    });
                  },
                },
              }}
            />
          </Col>
        </Row>
        <Modal
          title="排课"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={submitting}
        >
          <Form hideRequiredMark form={form} {...layout}>
            <Form.Item
              label="角色"
              name="roleId"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select onChange={handleRoleChange}>
                {allRoleList.map((item) => (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="老师"
              name="employeeId"
              rules={[{ required: true, message: '请选择老师' }]}
            >
              <Select>
                {teacherList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="患者"
              name="patientId"
              rules={[{ required: true, message: '请选择患者' }]}
            >
              <Select>
                {allPatientList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="课程"
              name="classId"
              rules={[{ required: true, message: '请选择课程' }]}
            >
              <Select>
                {allClassList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="课程内容"
              name="content"
              rules={[{ required: true, message: '请输入课程内容' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="日期" name="date" rules={[{ required: true, message: '请选择日期' }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="时间段"
              name="time"
              rules={[{ required: true, message: '请选择时间段' }]}
            >
              <Select>
                {timeList.map((item) => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.codeCn}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="教室位置"
              name="siteId"
              rules={[{ required: true, message: '请选择教室位置' }]}
            >
              <Select>
                {allSiteList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.place}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <FooterToolbar>
        <Button type="primary" onClick={() => history.push('/archives/childrehabilitation')}>
          进入康复计划
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['educationalAndCourseScheduling/create'],
}))(CourseScheduling);
