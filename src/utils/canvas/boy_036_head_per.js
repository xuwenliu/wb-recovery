import muBan from './myCanvas';

export default (myCanvas, head) => {
  var color = '#007FFF';
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
  var l = ['', '52', '50', '48', '46', '44', '42', '40', '38', '36', '34', '32'];
  var r = ['', '52', '50', '48', '46', '44', '42', '40', '38', '36', '34', '32'];
  var t = '头围(cm)';
  var b = '';
  var title = '中国0~3岁男童头围百分位曲线图';
  var arr_h_1 = [
    [0, 31.7],
    [1, 34.1],
    [2, 36],
    [3, 37.6],
    [4, 38.8],
    [5, 39.8],
    [6, 40.6],
    [7, 41.3],
    [8, 41.8],
    [9, 42.3],
    [10, 42.7],
    [11, 43.1],
    [12, 43.4],
    [13, 43.6],
    [14, 43.9],
    [15, 44.1],
    [16, 44.2],
    [17, 44.4],
    [18, 44.6],
    [19, 44.7],
    [20, 44.9],
    [21, 45.1],
    [22, 45.2],
    [23, 45.3],
    [24, 45.5],
    [25, 45.6],
    [26, 45.7],
    [27, 45.8],
    [28, 45.9],
    [29, 46],
    [30, 46.1],
    [31, 46.2],
    [32, 46.3],
    [33, 46.4],
    [34, 46.4],
    [35, 46.5],
    [36, 46.6],
  ];
  var arr_h_3 = [
    [0, 32.3],
    [1, 34.6],
    [2, 36.6],
    [3, 38.1],
    [4, 39.3],
    [5, 40.4],
    [6, 41.2],
    [7, 41.8],
    [8, 42.4],
    [9, 42.9],
    [10, 43.3],
    [11, 43.7],
    [12, 43.9],
    [13, 44.2],
    [14, 44.4],
    [15, 44.6],
    [16, 44.8],
    [17, 45],
    [18, 45.1],
    [19, 45.3],
    [20, 45.5],
    [21, 45.6],
    [22, 45.8],
    [23, 45.9],
    [24, 46],
    [25, 46.1],
    [26, 46.2],
    [27, 46.4],
    [28, 46.5],
    [29, 46.6],
    [30, 46.7],
    [31, 46.7],
    [32, 46.8],
    [33, 46.9],
    [34, 47],
    [35, 47.1],
    [36, 47.1],
  ];
  var arr_h_10 = [
    [0, 33],
    [1, 35.4],
    [2, 37.3],
    [3, 38.8],
    [4, 40.1],
    [5, 41.1],
    [6, 41.9],
    [7, 42.6],
    [8, 43.1],
    [9, 43.6],
    [10, 44],
    [11, 44.4],
    [12, 44.7],
    [13, 45],
    [14, 45.2],
    [15, 45.4],
    [16, 45.6],
    [17, 45.7],
    [18, 45.9],
    [19, 46.1],
    [20, 46.2],
    [21, 46.4],
    [22, 46.5],
    [23, 46.7],
    [24, 46.8],
    [25, 46.9],
    [26, 47],
    [27, 47.1],
    [28, 47.2],
    [29, 47.3],
    [30, 47.4],
    [31, 47.5],
    [32, 47.6],
    [33, 47.7],
    [34, 47.8],
    [35, 47.8],
    [36, 47.9],
  ];
  var arr_h_25 = [
    [0, 33.7],
    [1, 36.1],
    [2, 38.1],
    [3, 39.6],
    [4, 40.8],
    [5, 41.9],
    [6, 42.7],
    [7, 43.3],
    [8, 43.9],
    [9, 44.4],
    [10, 44.8],
    [11, 45.2],
    [12, 45.5],
    [13, 45.7],
    [14, 46],
    [15, 46.2],
    [16, 46.3],
    [17, 46.5],
    [18, 46.7],
    [19, 46.8],
    [20, 47],
    [21, 47.2],
    [22, 47.3],
    [23, 47.4],
    [24, 47.6],
    [25, 47.7],
    [26, 47.8],
    [27, 47.9],
    [28, 48],
    [29, 48.1],
    [30, 48.2],
    [31, 48.3],
    [32, 48.4],
    [33, 48.5],
    [34, 48.5],
    [35, 48.6],
    [36, 48.7],
  ];
  var arr_h_50 = [
    [0, 34.5],
    [1, 36.9],
    [2, 38.9],
    [3, 40.5],
    [4, 41.7],
    [5, 42.7],
    [6, 43.6],
    [7, 44.2],
    [8, 44.8],
    [9, 45.3],
    [10, 45.7],
    [11, 46.1],
    [12, 46.4],
    [13, 46.6],
    [14, 46.8],
    [15, 47],
    [16, 47.2],
    [17, 47.4],
    [18, 47.6],
    [19, 47.7],
    [20, 47.9],
    [21, 48],
    [22, 48.2],
    [23, 48.3],
    [24, 48.4],
    [25, 48.6],
    [26, 48.7],
    [27, 48.8],
    [28, 48.9],
    [29, 49],
    [30, 49.1],
    [31, 49.2],
    [32, 49.2],
    [33, 49.3],
    [34, 49.4],
    [35, 49.5],
    [36, 49.6],
  ];
  var arr_h_75 = [
    [0, 35.3],
    [1, 37.8],
    [2, 39.8],
    [3, 41.4],
    [4, 42.6],
    [5, 43.6],
    [6, 44.5],
    [7, 45.1],
    [8, 45.7],
    [9, 46.2],
    [10, 46.6],
    [11, 47],
    [12, 47.3],
    [13, 47.5],
    [14, 47.7],
    [15, 47.9],
    [16, 48.1],
    [17, 48.3],
    [18, 48.4],
    [19, 48.6],
    [20, 48.8],
    [21, 48.9],
    [22, 49.1],
    [23, 49.2],
    [24, 49.3],
    [25, 49.4],
    [26, 49.5],
    [27, 49.7],
    [28, 49.8],
    [29, 49.9],
    [30, 49.9],
    [31, 50],
    [32, 50.1],
    [33, 50.2],
    [34, 50.3],
    [35, 50.4],
    [36, 50.4],
  ];
  var arr_h_90 = [
    [0, 36],
    [1, 38.5],
    [2, 40.6],
    [3, 42.2],
    [4, 43.4],
    [5, 44.5],
    [6, 45.3],
    [7, 45.9],
    [8, 46.5],
    [9, 47],
    [10, 47.4],
    [11, 47.8],
    [12, 48.1],
    [13, 48.3],
    [14, 48.6],
    [15, 48.7],
    [16, 48.9],
    [17, 49.1],
    [18, 49.3],
    [19, 49.4],
    [20, 49.6],
    [21, 49.7],
    [22, 49.9],
    [23, 50],
    [24, 50.1],
    [25, 50.2],
    [26, 50.4],
    [27, 50.5],
    [28, 50.6],
    [29, 50.7],
    [30, 50.8],
    [31, 50.8],
    [32, 50.9],
    [33, 51],
    [34, 51.1],
    [35, 51.2],
    [36, 51.2],
  ];
  var arr_h_97 = [
    [0, 36.7],
    [1, 39.3],
    [2, 41.4],
    [3, 43],
    [4, 44.3],
    [5, 45.3],
    [6, 46.1],
    [7, 46.8],
    [8, 47.3],
    [9, 47.8],
    [10, 48.3],
    [11, 48.6],
    [12, 48.9],
    [13, 49.2],
    [14, 49.4],
    [15, 49.6],
    [16, 49.7],
    [17, 49.9],
    [18, 50.1],
    [19, 50.2],
    [20, 50.4],
    [21, 50.5],
    [22, 50.7],
    [23, 50.8],
    [24, 50.9],
    [25, 51.1],
    [26, 51.2],
    [27, 51.3],
    [28, 51.4],
    [29, 51.5],
    [30, 51.6],
    [31, 51.6],
    [32, 51.7],
    [33, 51.8],
    [34, 51.9],
    [35, 52],
    [36, 52],
  ];
  var arr_h_99 = [
    [0, 37.2],
    [1, 39.8],
    [2, 42],
    [3, 43.6],
    [4, 44.9],
    [5, 46],
    [6, 46.8],
    [7, 47.4],
    [8, 48],
    [9, 48.5],
    [10, 48.9],
    [11, 49.2],
    [12, 49.5],
    [13, 49.8],
    [14, 50],
    [15, 50.2],
    [16, 50.4],
    [17, 50.5],
    [18, 50.7],
    [19, 50.8],
    [20, 51],
    [21, 51.2],
    [22, 51.3],
    [23, 51.4],
    [24, 51.5],
    [25, 51.7],
    [26, 51.8],
    [27, 51.9],
    [28, 52],
    [29, 52.1],
    [30, 52.2],
    [31, 52.2],
    [32, 52.3],
    [33, 52.4],
    [34, 52.5],
    [35, 52.6],
    [36, 52.6],
  ];

  var m = new muBan(35, 60, 100, 100);
  var c = document.getElementById(myCanvas);
  var ctx = c.getContext('2d');

  m.box(ctx, color, 0.75, 0.2, 19, 38, 13, 52); //画格子
  m.txt(ctx, color, font, a, a, l, r, t, b, 19, 13); //写字
  m.title(ctx, color, font2, title, 19);

  //头围
  m.line(ctx, 36, color, 2, arr_h_1, 11, 32, 2, 2, false, false, '1');
  m.line(ctx, 36, color, 0.5, arr_h_3, 11, 32, 2, 2, false, false, '3');
  m.line(ctx, 36, color, 0.5, arr_h_10, 11, 32, 2, 2, false, false, '10');
  m.line(ctx, 36, color, 0.5, arr_h_25, 11, 32, 2, 2, false, false, '25');
  m.line(ctx, 36, color, 2, arr_h_50, 11, 32, 2, 2, false, false, '50');
  m.line(ctx, 36, color, 0.5, arr_h_75, 11, 32, 2, 2, false, false, '75');
  m.line(ctx, 36, color, 0.5, arr_h_90, 11, 32, 2, 2, false, false, '90');
  m.line(ctx, 36, color, 0.5, arr_h_97, 11, 32, 2, 2, false, false, '97');
  m.line(ctx, 36, color, 2, arr_h_99, 11, 32, 2, 2, false, false, '99');

  head && m.line(ctx, 36, color_, 2, head, 11, 32, 2, 2, true, false, null); //头围
};
