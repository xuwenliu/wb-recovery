import { connect } from 'dva';
import Page from './index';

export default connect(({ scaleComposeReport, loading }) => ({
  loading: loading.effects['scaleComposeReport/fetchGuide'],
  scaleComposeReport,
}))(Page);
