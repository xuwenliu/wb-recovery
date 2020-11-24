import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ScaleSuggestDetail from './ScaleSuggestDetail';
// https://github.com/frankiez/seal-generator/blob/master/lib/index.ts

function ScaleSuggestList({
  items,
  itemRender: ItemRender,
  showType = true,
  showSubScale = true,
  showPlan = false,
  value,
  onChange,
}) {
  const data = {};
  items.forEach(ele => {
    const [type, name, number] = ele.no.split('.');
    // console.log(type, name, number);
    if (data[type] === undefined) {
      data[type] = {};
    }
    if (data[type][name] === undefined) {
      data[type][name] = [];
    }

    data[type][name].push(ele);
  });

  return (
    <div>
      {Object.keys(data).map(type => (
        <div key={type}>
          <List
            component="nav"
            dense
            subheader={
              showType && (
                <ListSubheader>
                  <Typography variant="h6" component="h6" gutterBottom>
                    {type}
                  </Typography>
                </ListSubheader>
              )
            }
          >
            {Object.keys(data[type]).map(name => (
              <div key={type + name}>
                {showSubScale && (
                  <ListSubheader>
                    <Typography gutterBottom>{name}</Typography>
                  </ListSubheader>
                )}

                {data[type][name].map((suggest, index) => (
                  <Fragment key={suggest.no}>
                    <ListItem button>
                      <ListItemText
                        inset
                        primary={
                          ItemRender ? (
                            <ItemRender showPlan={showPlan} suggest={suggest} />
                          ) : (
                            <ScaleSuggestDetail
                              showPlan={showPlan}
                              suggest={suggest}
                              value={value}
                              onChange={onChange}
                            />
                          )
                        }
                      />
                    </ListItem>
                  </Fragment>
                ))}
              </div>
            ))}
          </List>
        </div>
      ))}
      {/**
         * <List component="nav" dense>
        {items.map(({ no, desc }, index) => (
          <Fragment key={no}>
            <ListItem button>
              <ListItemText inset primary={desc} />
            </ListItem>
          </Fragment>
        ))}
      </List>
         */}
    </div>
  );
}

export default ScaleSuggestList;
