import React, { PureComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(2),
  },
}));

const CardList = ({ contents, onClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <Card>
        <CardContent>
          {contents}
          <CardActions>
            <Button
              startIcon={<EditIcon />}
              onClick={onClick}
              color="primary"
              variant="contained"
              className={classes.button}
            >
              开始答題
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
};

class Page extends PureComponent {
  render() {
    const { children, onClick } = this.props;
    return <CardList contents={children} onClick={onClick} />;
  }
}
export default Page;
