// gender 性别 1= 男 2= 女
// age 1= 0~3岁 2= 2-18岁
// type 1= 身高、体重百分位曲线图  2= 身高、体重标准差单位曲线图 3= 头围百分位曲线图

import boy_036_head_per from './boy_036_head_per';
import boy_036_per from './boy_036_per';
import boy_036_stand from './boy_036_stand';
import boy_218_per from './boy_218_per';
import boy_218_stand from './boy_218_stand';
import girl_036_head_per from './girl_036_head_per';
import girl_036_per from './girl_036_per';
import girl_036_stand from './girl_036_stand';
import girl_218_per from './girl_218_per';
import girl_218_stand from './girl_218_stand';
import M from './canvas_t';

export const charts = (canvas, gender, age, type, { height, weight, head }) => {
  if (gender === 1) {
    if (age === 1) {
      switch (type) {
        case 1:
          boy_036_per(canvas, height, weight);
          break;
        case 2:
          boy_036_stand(canvas, height, weight);
          break;
        case 3:
          boy_036_head_per(canvas, head);
          break;
      }
    }
    if (age === 2) {
      switch (type) {
        case 1:
          boy_218_per(canvas, height, weight);
          break;
        case 2:
          boy_218_stand(canvas, height, weight);
          break;
      }
    }
  }
  if (gender === 2) {
    if (age === 1) {
      switch (type) {
        case 1:
          girl_036_per(canvas, height, weight);
          break;
        case 2:
          girl_036_stand(canvas, height, weight);
          break;
        case 3:
          girl_036_head_per(canvas, head);
          break;
      }
    }
    if (age === 2) {
      switch (type) {
        case 1:
          girl_218_per(canvas, height, weight);
          break;
        case 2:
          girl_218_stand(canvas, height, weight);
          break;
      }
    }
  }
};

export const lateralView = (canvas, json, title, content, fix_score, total) => {
  let m = new M();
  m.t(canvas, json, title, content, fix_score, total);
};

export const clearCanvas = (canvas) => {
  var c = document.getElementById(canvas);
  var cxt = c.getContext('2d');
  cxt.clearRect(0, 0, c.width, c.height);
};
