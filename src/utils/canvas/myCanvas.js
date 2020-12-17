var muBan = function (HB, VB, STH, STV) {
  this.HB = HB;
  this.VB = VB;
  this.STH = STH;
  this.STV = STV;
  /**
   * color颜色
   * linewidth1 线宽1，粗
   * linewidth2 线宽2，细
   * v_num1 粗线数量（纵线）
   * v_num2 细线数量
   * h_num1 粗线数量（横线）
   * h_num2 细线数量
   */
  this.box = function (ctx, color, linewidth1, linewidth2, v_num1, v_num2, h_num1, h_num2) {
    v_num1--;
    h_num1--;
    ///////粗线
    ctx.beginPath();
    //第一根竖线
    ctx.moveTo(this.STH - this.HB, 0 * this.VB + this.STV);
    ctx.lineTo(this.STH - this.HB, h_num1 * this.VB + this.STV);
    for (var i = 0; i <= v_num1; i++) {
      //竖线
      ctx.moveTo(i * this.HB + this.STH, 0 * this.VB + this.STV);
      ctx.lineTo(i * this.HB + this.STH, h_num1 * this.VB + this.STV);
    }
    //最后一根线竖线
    ctx.moveTo(i * this.HB + this.STH, 0 * this.VB + this.STV);
    ctx.lineTo(i * this.HB + this.STH, h_num1 * this.VB + this.STV);
    for (var i = 0; i <= h_num1; i++) {
      //竖线
      if (i == 0 || i == h_num1) {
        ctx.moveTo(0 * this.HB + this.STH - this.HB, i * this.VB + this.STV);
        ctx.lineTo(v_num1 * this.HB + this.STH + this.HB, i * this.VB + this.STV);
      } else {
        ctx.moveTo(0 * this.HB + this.STH, i * this.VB + this.STV);
        ctx.lineTo(v_num1 * this.HB + this.STH, i * this.VB + this.STV);
      }
    }
    ctx.lineWidth = linewidth1;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();

    ///////细线
    ctx.beginPath();
    var HB_jg = parseInt(v_num2 / v_num1); //计算出间隔，v_num2是v_num1的倍数
    //			console.log(HB_jg)
    v_num2 = v_num2 - HB_jg; //最后几根线不画
    for (var i = 0; i <= v_num2; i++) {
      //竖线
      ctx.moveTo((i * this.HB) / HB_jg + this.STH, 0 * this.VB + this.STV);
      ctx.lineTo((i * this.HB) / HB_jg + this.STH, h_num1 * this.VB + this.STV);
    }

    var VB_jg = parseInt(h_num2 / h_num1);
    //			console.log(VB_jg)
    h_num2 = h_num2 - VB_jg;
    for (var i = 0; i <= h_num2; i++) {
      //竖线
      if (i % 2 == 1) {
        ctx.moveTo(0 * this.HB + this.STH - 5, (i * this.VB) / VB_jg + STV);
        ctx.lineTo(v_num1 * this.HB + this.STH + 5, (i * this.VB) / VB_jg + STV);
      } else {
        ctx.moveTo(0 * this.HB + this.STH - 10, (i * this.VB) / VB_jg + this.STV);
        ctx.lineTo(v_num1 * this.HB + this.STH + 10, (i * this.VB) / VB_jg + this.STV);
      }
    }
    ctx.lineWidth = linewidth2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  };

  /**
   * txt_arr_t  上方显示的文字数组
   * txt_arr_b  下方显示的文字数组
   * h_num1   总共多少格，便于显示下方的文字
   * txt_arr_l  左边显示的文字数组
   * txt_arr_r  右边显示的文字数组
   * v_num1   总共多少格，便于显示右方的文字
   * */
  this.txt = function (
    ctx,
    color,
    font,
    txt_arr_t,
    txt_arr_b,
    txt_arr_l,
    txt_arr_r,
    txt_t,
    txt_b,
    v_num1,
    h_num1,
  ) {
    h_num1--;
    v_num1--;
    ctx.fillStyle = color;
    ctx.font = font;
    for (var i = 0; i < txt_arr_t.length; i++) {
      ctx.fillText(txt_arr_t[i], i * this.HB + this.STH - 3, this.STV - 7); //上
    }
    for (var i = 0; i < txt_arr_b.length; i++) {
      ctx.fillText(txt_arr_b[i], i * this.HB + this.STH - 3, h_num1 * this.VB + this.STV + 15); //下
    }
    for (var i = 0; i < txt_arr_l.length; i++) {
      ctx.fillText(txt_arr_l[i], this.STH - 25, i * this.VB + this.STV + 5); //左
    }
    for (var i = 0; i < txt_arr_r.length; i++) {
      ctx.fillText(txt_arr_r[i], v_num1 * this.HB + this.STH + 7, i * this.VB + this.STV + 5); //右
    }

    ctx.fillText(txt_t, this.STH - this.HB - 60, 5 * this.VB + this.STV, 50); //左 上
    ctx.fillText(txt_t, v_num1 * this.HB + this.STH + this.HB + 10, 2.5 * this.VB + this.STV, 50); //右 上

    ctx.fillText(txt_b, this.STH - this.HB - 60, (h_num1 - 1.5) * this.VB + this.STV, 50); //左 下
    ctx.fillText(
      txt_b,
      v_num1 * this.HB + this.STH + this.HB + 10,
      (h_num1 - 4) * this.VB + this.STV,
      50,
    ); //右 下
  };

  /**
   *v_num1  限制显示的宽度
   * */
  this.title = function (ctx, color, font, title, v_num1) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(title, this.HB + this.STH, this.STV / 2, (v_num1 - 3) * this.HB); //左 上
  };

  /**
   * ctx
   * wh	218表示 2~18岁，36表示 0~36月
   * color  颜色
   * linewidth  线宽
   * arr  数组
   * s_num  起始大格
   * s_value  起始值
   * per_v   纵向每个大格中有多少个小格
   * per_h	横向，每大格中有几格数据
   * is_arc	是否画小圆点
   * is_dash  是否画虚线
   * sign		标识
   * */
  this.line = function (
    ctx,
    wh,
    color,
    linewidth,
    arr,
    s_num,
    s_value,
    per_v,
    per_h,
    is_arc,
    is_dash,
    sign,
  ) {
    var x, x1, x2, x3, y, y1, y2;
    ctx.beginPath();
    y1 = s_num - (arr[0][1] - s_value) / per_v;
    if (arr[0][0] == 0) {
      ctx.moveTo(this.STH, y1 * this.VB + this.STV);
      if (is_arc) {
        ctx.arc(this.STH, y1 * this.VB + this.STV, 1.5, 0, 2 * Math.PI);
      }
    } else {
      if (wh == 218) {
        //2~18岁
        x3 = (arr[0][0] - 2) * 2; //2岁起算，每半岁一个数据
      } else if (wh == 36) {
        //0~36月
        x3 = arr[0][0];
      }
      ctx.moveTo((x3 * this.HB) / per_h + this.STH, y1 * this.VB + this.STV);
      ctx.arc((x3 * this.HB) / per_h + this.STH, y1 * this.VB + this.STV, 1.5, 0, 2 * Math.PI);
    }

    for (var j = 1, len = arr.length; j < len; j++) {
      x = arr[j][0];
      if (wh == 218) {
        //2~18岁
        x1 = (x - 2) * 2; //2岁起算，每半岁一个数据
      } else if (wh == 36) {
        //0~36月
        x1 = x;
        //					x1 = (x-45)		//
      }
      y = arr[j][1];
      y1 = s_num - (y - s_value) / per_v;
      x2 = (x1 * this.HB) / per_h + this.STH;
      y2 = y1 * this.VB + this.STV;
      ctx.lineTo(x2, y2);
      if (is_arc) {
        ctx.arc(x2, y2, 1.5, 0, 2 * Math.PI);
      }
    }
    //			console.log(is_dash);
    if (is_dash) {
      ctx.setLineDash([10, 5]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    if (sign != null) {
      ctx.fillStyle = '#000000';
      ctx.font = '11px Microsoft YaHei';
      ctx.fillText(sign, x2 - this.HB / 1.5, y2);
    }
    ctx.closePath();
  };
};

export default muBan;
