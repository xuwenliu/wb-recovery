import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'umi';
import { Row, Col, Card, Avatar, Pagination } from 'antd';
// import uuid from 'uuid';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.css';

@connect(({ user, project, loading }) => ({
  currentUser: user.currentUser,
  project,
  loading: loading.effects['project/fetch'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetch',
      payload: 0,
    });
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'chart/clear',
  //   });
  // }

  /**
   statusimg = close => {
    const imgsrc = close === false ? processimg : finishimg;
    return imgsrc;
  }; */

  onChange = (pageNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetch',
      payload: pageNumber - 1,
    });
  };

  render() {
    const {
      loading,
      project: { list },
    } = this.props;

    const { content = [] } = list;

    return (
      <PageHeaderWrapper title="项目列表" loading={loading}>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="进行中的项目"
              bordered={false}
              extra={<Link to="/project/detail">项目建立</Link>}
              bodyStyle={{ padding: 0 }}
            >
              {content.map((item) => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div>
                          <Avatar
                            style={{ backgroundColor: !item.close ? '#1890FF' : '' }}
                            icon="project"
                          />
                          <Link to={`/project/detail?id=${item.id}`}>{item.name}</Link>
                        </div>
                      }
                      // description={<span>{item.description || ''}</span>}
                    />
                    <div>
                      <ul>
                        {item.works &&
                          item.works.map((work) => <li key={work.name}>{work.name}</li>)}
                      </ul>
                    </div>
                    <div>
                      {item.start && (
                        <span title={item.start}>
                          开始时间：{moment(item.start).format('YYYY-MM-DD')}
                        </span>
                      )}
                      {item.end && (
                        <span
                          className={styles.datetime}
                          style={{ textAlign: 'right' }}
                          title={item.end}
                        >
                          截止时间：{moment(item.end).format('YYYY-MM-DD')}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Pagination
              style={{ textAlign: 'center' }}
              onChange={this.onChange}
              defaultCurrent={1}
              total={list.totalElements}
            />
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
