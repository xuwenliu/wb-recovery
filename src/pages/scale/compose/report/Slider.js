/* eslint-disable prefer-destructuring */
import React, { useEffect } from 'react';

import { uniqueId } from 'lodash/util';
import { makeStyles } from '@material-ui/core/styles';

function Slider(props) {

  const id = `canvas-${uniqueId()}`;

  useEffect(() => {
    
    var can = document.getElementById(id);  
    var ctx = can.getContext("2d"); 

    ctx.fillStyle = "blue";  
    ctx.font = "20pt Ariel";  
    ctx.textAlign = "center";  
    ctx.textBaseline = "bottom";  

    return () => {};
  }, []);

  return (
    <canvas id={id} height="200" width="300">123</canvas>
  );
}

export default Slider;
