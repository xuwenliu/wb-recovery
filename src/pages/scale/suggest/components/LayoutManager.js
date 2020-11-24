import React from 'react';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LabelIcon from '@material-ui/icons/Label';
import { uniqueId } from 'lodash/util';

import GridLayout from './GridLayout';
import AccordionLayout from './AccordionLayout';

const isChecked = ({ items, no }) => {
  if (items[no] !== undefined) {
    return true;
  }
  return false;
};

const getUI = ({ define, top }) => {
  if (define && define[top] && define[top].render) {
    return define[top].render;
  }

  return null;
};

const getMethod = ({ define, top }) => {
  if (define && define[top] && define[top].getValues) {
    return define[top].getValues;
  }

  return null;
};

function Panel({ layout = 'grid', items, top, sub, list, changeValue, define, full }) {
  const UI = getUI({ define, top });
  const getValues = getMethod({ define, top });

  // console.log('panel ,[', top , '][',sub,']');

  return (
    <div>
      {list.map(
        ({ name, children }) =>
          children.length > 0 && (
            <div key={uniqueId()}>
              {name === 'DEFAULT' ? null : (
                <Typography gutterBottom style={{ padding: '10px' }}>
                  {name}
                </Typography>
              )}
              {layout === 'grid' ? (
                <GridLayout
                  type={top}
                  scale={sub} 
                  ds={name}
                  questions={children}
                  full={full}
                  getValues={getValues}
                  changeValue={changeValue}
                  UI={UI}
                  items={items}
                  isChecked={isChecked}
                />
              ) : (
                <AccordionLayout
                  questions={children}
                  full={full}
                  getValues={getValues}
                  changeValue={changeValue}
                  UI={UI}
                  items={items}
                  isChecked={isChecked}
                />
              )}
            </div>
          )
      )}
    </div>
  );
}

function LayoutManager(props) {
  const { layout, example, items, changeValue, define, full = false, displayType = true } = props;
  const [tab, setTab] = React.useState(0);

  const changeTab = (event, newValue) => {
    setTab(newValue);
  };

  const getDisplayData = () => {
    const index = example.findIndex(i => i.tab === tab);

    if (index === -1) {
      return { items: [] };
    }

    return example[index];
  };

  const display = getDisplayData();
  return (
    <div>
      {example.length === 1 ? null : (
        <AppBar position="static">
          <Tabs value={tab} onChange={changeTab} centered variant="fullWidth" textColor="secondary">
            {example.map(({ name }) => (
              <Tab key={`tab.${name}`} label={name} />
            ))}
          </Tabs>
        </AppBar>
      )}
      
      {display.children.map(({ name, children }) => (
        <div key={uniqueId()} style={{ padding: '20px' }}>
          {displayType && (
            <Typography variant="h6" color="secondary" gutterBottom>
              <LabelIcon /> <span style={{ verticalAlign: 'top' }}>{name}</span>
            </Typography>
          )}
          <Panel
            layout={layout}
            items={items}
            define={define}
            top={display.name}
            sub={name}
            list={children}
            changeValue={changeValue}
            full={full}
          />
        </div>
      ))}
    </div>
  );
}

export default LayoutManager;
