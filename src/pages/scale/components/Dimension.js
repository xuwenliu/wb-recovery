/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

class Page extends Component {
  state = {};

  getSpace(dimension) {
    if (dimension.level) {
      return dimension.level * 20;
    }
    return 0;
  }

  level(dimension) {
    if (dimension.level) {
      const width = dimension.level * 10;
      return (
        <span style={{ backgroundColor: 'yellow', width: `${width}px` }}>{dimension.level}</span>
      );
    }
  }

  render() {
    const { dimensions = [] } = this.props;

    return (
      <>
        {dimensions.map(dimension => (
          <div key={dimension.id} style={{ marginTop: '20px' }}>
            <Typography level={4} variant="body1" gutterBottom>
              {dimension.level ? '子維度' : '維度'}:{dimension.name}
              <Typography level={4} variant="body1" gutterBottom>
                維度分：{dimension.score}
              </Typography>
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {dimension.scoreExplain}
            </Typography>
            <Divider />
            <Page dimensions={dimension.dimensions} />
          </div>
        ))}
      </>
    );
  }
}

export default Page;
