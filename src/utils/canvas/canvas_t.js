import muban from './canvas_x';

var M = function () {
  this.t = function (canvas, data, title, content, fix_score, totall) {
    var c = document.getElementById(canvas);
    var ctx = c.getContext('2d');
    //		var title = "侧面图（三）2.粗大动作";
    var arr = []; //显示内容(文字、分值)
    var arr2 = []; //最下文字
    var count = Object.keys(data).length;
    var v_or_h = 0;
    if (totall) {
      arr = data;
      v_or_h = 0; //文字横写
    } else {
      v_or_h = 1; //文字竖写
      for (var i = 0; i < count; i++) {
        //			if(data[i].name == "粗大动作"){
        if (content == null) {
          //					arr.push(...data[i].children);
          arr.push.apply(arr, data[i].children);
          arr2[i] = [data[i].name, Object.keys(data[i].children).length];
        } else if (data[i].name == content) {
          var a = data[i].children;
          var a_count = Object.keys(a).length;
          for (var j = 0; j < a_count; j++) {
            //						arr.push(...a[j].children);
            arr.push.apply(arr, a[j].children);
            arr2[j] = [a[j].name, Object.keys(a[j].children).length];
          }
        }
      }
    }
    var arr_count = Object.keys(arr).length;
    console.log(arr_count);
    var HB = 850 / arr_count;
    var m = new muban(HB, 100, 120, 100);
    m.box(ctx, arr_count, 3); //画格子
    m.line(ctx, arr_count, 3, arr, fix_score, v_or_h, arr2); //画线
    m.title(ctx, arr_count, title);
  };
};

export default M;
