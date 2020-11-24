import CreateCheckupRecord from '../components/CreateCheckupRecord';

const Detail = ({ location }) => {
  const recordId = location.query.id;
  return <CreateCheckupRecord recordId={recordId} />;
};

export default Detail;
