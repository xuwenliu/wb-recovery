import muBan from './myCanvas';
export default (myCanvas, height, weight) => {
  var color = '#FF0000';
  var color_ = '#000000';

  var font = '12px Arial';
  var font2 = '30px Microsoft YaHei';
  var a = [
    '0',
    '2',
    '4',
    '6',
    '8',
    '10',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
    '26',
    '28',
    '30',
    '32',
    '34',
    '36月',
  ];
  var l = [
    '',
    '105',
    '100',
    '95',
    '90',
    '85',
    '80',
    '75',
    '70',
    '65',
    '60',
    '55',
    '50',
    '45',
    '6',
    '4',
    '2',
  ];
  var r = [
    '',
    '105',
    '100',
    '95',
    '90',
    '85',
    '22',
    '20',
    '18',
    '16',
    '14',
    '12',
    '10',
    '8',
    '6',
    '4',
    '2',
  ];
  var t = '身高(cm)';
  var b = '体重(kg)';
  var title = '中国0~3岁女童身高、体重标准差单位曲线图';
  var arr_h_n3 = [
    [0, 44.7],
    [2, 51.1],
    [4, 56.7],
    [6, 60.1],
    [9, 63.7],
    [12, 67.2],
    [15, 70.2],
    [18, 72.8],
    [21, 75.1],
    [24, 77.3],
    [30, 81.4],
    [36, 84.7],
  ];
  var arr_h_n2 = [
    [0, 46.4],
    [2, 53.2],
    [4, 58.8],
    [6, 62.3],
    [9, 66.1],
    [12, 69.7],
    [15, 72.9],
    [18, 75.6],
    [21, 78.1],
    [24, 80.5],
    [30, 84.8],
    [36, 88.2],
  ];
  var arr_h_n1 = [
    [0, 48],
    [2, 55.3],
    [4, 61],
    [6, 64.5],
    [9, 68.5],
    [12, 72.3],
    [15, 75.6],
    [18, 78.5],
    [21, 81.2],
    [24, 83.8],
    [30, 88.4],
    [36, 91.8],
  ];
  var arr_h_0 = [
    [0, 49.7],
    [2, 57.4],
    [4, 63.1],
    [6, 66.8],
    [9, 71],
    [12, 75],
    [15, 78.5],
    [18, 81.5],
    [21, 84.4],
    [24, 87.2],
    [30, 92.1],
    [36, 95.6],
  ];
  var arr_h_1 = [
    [0, 51.4],
    [2, 59.6],
    [4, 65.4],
    [6, 69.1],
    [9, 73.6],
    [12, 77.7],
    [15, 81.4],
    [18, 84.6],
    [21, 87.7],
    [24, 90.7],
    [30, 95.9],
    [36, 99.4],
  ];
  var arr_h_2 = [
    [0, 53.2],
    [2, 61.8],
    [4, 67.7],
    [6, 71.5],
    [9, 76.2],
    [12, 80.5],
    [15, 84.3],
    [18, 87.7],
    [21, 91.1],
    [24, 94.3],
    [30, 99.8],
    [36, 103.4],
  ];
  var arr_h_3 = [
    [0, 55],
    [2, 64.1],
    [4, 70],
    [6, 74],
    [9, 78.9],
    [12, 83.4],
    [15, 87.4],
    [18, 91],
    [21, 94.5],
    [24, 98],
    [30, 103.8],
    [36, 107.4],
  ];

  var arr_w_n3 = [
    [0, 2.26],
    [2, 3.72],
    [4, 4.93],
    [6, 5.64],
    [9, 6.34],
    [12, 6.87],
    [15, 7.34],
    [18, 7.79],
    [21, 8.26],
    [24, 8.7],
    [30, 9.48],
    [36, 10.23],
  ];
  var arr_w_n2 = [
    [0, 2.54],
    [2, 4.15],
    [4, 5.48],
    [6, 6.26],
    [9, 7.03],
    [12, 7.61],
    [15, 8.12],
    [18, 8.63],
    [21, 9.15],
    [24, 9.64],
    [30, 10.52],
    [36, 11.36],
  ];
  var arr_w_n1 = [
    [0, 2.85],
    [2, 4.65],
    [4, 6.11],
    [6, 6.96],
    [9, 7.81],
    [12, 8.45],
    [15, 9.01],
    [18, 9.57],
    [21, 10.15],
    [24, 10.7],
    [30, 11.7],
    [36, 12.65],
  ];
  var arr_w_0 = [
    [0, 3.21],
    [2, 5.21],
    [4, 6.83],
    [6, 7.77],
    [9, 8.69],
    [12, 9.4],
    [15, 10.02],
    [18, 10.65],
    [21, 11.3],
    [24, 11.92],
    [30, 13.05],
    [36, 14.13],
  ];
  var arr_w_1 = [
    [0, 3.63],
    [2, 5.86],
    [4, 7.65],
    [6, 8.68],
    [9, 9.7],
    [12, 10.48],
    [15, 11.18],
    [18, 11.88],
    [21, 12.61],
    [24, 13.31],
    [30, 14.6],
    [36, 15.83],
  ];
  var arr_w_2 = [
    [0, 4.1],
    [2, 6.6],
    [4, 8.59],
    [6, 9.73],
    [9, 10.86],
    [12, 11.73],
    [15, 12.5],
    [18, 13.29],
    [21, 14.12],
    [24, 14.92],
    [30, 16.39],
    [36, 17.81],
  ];
  var arr_w_3 = [
    [0, 4.65],
    [2, 7.46],
    [4, 9.66],
    [6, 10.93],
    [9, 12.18],
    [12, 13.15],
    [15, 14.02],
    [18, 14.9],
    [21, 15.85],
    [24, 16.77],
    [30, 18.47],
    [36, 20.1],
  ];

  var m = new muBan(35, 60, 100, 100);
  var c = document.getElementById(myCanvas);
  var ctx = c.getContext('2d');

  m.box(ctx, color, 0.75, 0.2, 19, 38, 18, 180); //画格子
  m.txt(ctx, color, font, a, a, l, r, t, b, 19, 18); //写字
  m.title(ctx, color, font2, title, 19);

  //身高
  m.line(ctx, 36, color, 1, arr_h_n3, 13, 45, 5, 2, false, true, '-3');
  m.line(ctx, 36, color, 2, arr_h_n2, 13, 45, 5, 2, false, false, '-2');
  m.line(ctx, 36, color, 1, arr_h_n1, 13, 45, 5, 2, false, false, '-1');
  m.line(ctx, 36, color, 2, arr_h_0, 13, 45, 5, 2, false, false, '-0');
  m.line(ctx, 36, color, 1, arr_h_1, 13, 45, 5, 2, false, false, '+1');
  m.line(ctx, 36, color, 2, arr_h_2, 13, 45, 5, 2, false, false, '+2');
  m.line(ctx, 36, color, 1, arr_h_3, 13, 45, 5, 2, false, true, '+3');

  //体重
  m.line(ctx, 36, color, 1, arr_w_n3, 16, 2, 2, 2, false, true, '-3');
  m.line(ctx, 36, color, 2, arr_w_n2, 16, 2, 2, 2, false, false, '-2');
  m.line(ctx, 36, color, 1, arr_w_n1, 16, 2, 2, 2, false, false, '-1');
  m.line(ctx, 36, color, 2, arr_w_0, 16, 2, 2, 2, false, false, '0');
  m.line(ctx, 36, color, 1, arr_w_1, 16, 2, 2, 2, false, false, '+1');
  m.line(ctx, 36, color, 2, arr_w_2, 16, 2, 2, 2, false, false, '+2');
  m.line(ctx, 36, color, 1, arr_w_3, 16, 2, 2, 2, false, true, '+3');

  height && m.line(ctx, 36, color_, 1, height, 13, 45, 5, 2, true, false, null); //身高
  weight && m.line(ctx, 36, color_, 1, weight, 16, 2, 2, 2, true, false, null); //体重


  //左上角实时显示数值
  c.addEventListener("mousemove", function(e) {
    var cRect = c.getBoundingClientRect();
    var canvasX = Math.round(e.clientX - cRect.left);
    var canvasY = Math.round(e.clientY - cRect.top);
    ctx.clearRect(0, 0, 300, 25); //清空制定区域
    var Xx = "--";
    if (canvasX > 100 && canvasX <= 100 + (35 * 18)) {
      Xx = (canvasX - 100) * 2 / 35;
    }
    var Yy = "--";
    var Yy2 = "--";
    if (canvasY > 100 && canvasY <= 100 + (60 * 17)) {
      Yy = 110 - (canvasY - 100) * 5 / 60;
      Yy2 = 34 - (canvasY - 100) * 2 / 60;
    }
    var age = typeof Xx === 'number' ? Xx.toFixed(1) : Xx;
    var height = typeof Yy === 'number' ? Yy.toFixed(1) : Yy;
    var weight = typeof Yy2 === 'number' ? Yy2.toFixed(1) : Yy2;
    ctx.fillText("年龄:" + age + "个月，身高:" + height + "cm，体重:" + weight + "kg", 10, 20);
  });
};
