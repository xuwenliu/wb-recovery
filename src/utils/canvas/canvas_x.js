//其中text, x, y 3个参数和fillText()方法中的这3个参数含义是一样的
//maxWidth表示最大需要换行的宽度,lineHeight表示行高
//默认会使用canvas画布的width宽度作为maxWidth；lineHeight表示行高，默认会使用<canvas>元素在DOM中继承的line-height作为行高
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
  if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
    return;
  }

  var context = this;
  var canvas = context.canvas;

  if (typeof maxWidth == 'undefined') {
    maxWidth = (canvas && canvas.width) || 300;
  }
  if (typeof lineHeight == 'undefined') {
    lineHeight =
      (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) ||
      parseInt(window.getComputedStyle(document.body).lineHeight);
  }

  // 字符分隔为数组
  var arrText = text.split('');
  var line = '';

  for (var n = 0; n < arrText.length; n++) {
    var testLine = line + arrText[n];
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = arrText[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
};

var muban = function (HB, VB, STH, STV) {
  this.HB = HB;
  this.VB = VB;
  this.STH = STH;
  this.STV = STV;
  this.txt_arr_num = ['3', '2', '1', '0']; //左侧数字
  this.txt_arr_t = [
    '已发展出适应环境需要的能力',
    '已发展较多能力只需重点协助，便能适应环境的需要',
    '仅发展些微能力，需要特别协助，才能适应环境的需要',
    '尚未开始发展，无法适应环境的需要',
  ]; //左侧文字

  /**
   * num_v 需要画的竖线的数量
   * num_h 需要画的横线的数量
   * */
  this.box = function (ctx, num_v, num_h) {
    ctx.beginPath();
    for (var i = 0; i <= num_v; i++) {
      //竖线
      ctx.moveTo(i * this.HB + this.STH, 0 * this.VB + this.STV);
      ctx.lineTo(i * this.HB + this.STH, num_h * this.VB + this.STV);
    }
    for (var i = 0; i <= num_h; i++) {
      //横线
      ctx.moveTo(0 * this.HB + this.STH, i * this.VB + this.STV);
      ctx.lineTo(num_v * this.HB + STH, i * this.VB + this.STV);
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    //左侧数字
    for (var i = 0; i < this.txt_arr_num.length; i++) {
      ctx.fillText(this.txt_arr_num[i], 0 * this.HB + this.STH - 10, i * this.VB + this.STV); //左
    }
    //左侧文字，换行显示
    for (var i = 0; i < this.txt_arr_t.length; i++) {
      ctx.wrapText(this.txt_arr_t[i], 0 * HB + 8, i * VB + this.STV, this.STH - 30, 15);
    }
    ctx.closePath();
  };

  /**
   * num_v 需要画的竖线的数量
   * num_h 需要画的横线的数量
   * name_score 需要显示的名称和得分
   * fix_score 固定的得分
   * v_or_h 下方文字，0横写，1竖写，默认横写
   * */
  this.line = function (ctx, num_v, num_h, name_score, fix_score, v_or_h, name2) {
    ctx.beginPath();
    for (var i = 0; i < num_v; i++) {
      var x = i * this.HB + this.HB / 2 + this.STH;
      if (fix_score != null) {
        var y = parseInt(
          (1 - name_score[i].score / fix_score[name_score[i].name]) * 3 * this.VB + this.STV,
        );
      } else {
        var y = parseInt((1 - name_score[i].score / 3) * 3 * this.VB + this.STV);
      }
      //						console.log(json[i].score+"---"+n[i])
      ctx.fillStyle = '#ff0000'; //文字颜色
      ctx.strokeStyle = '#ff0000'; //图形颜色
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillText(name_score[i].score, x, y - 10); //数字
      ctx.fillStyle = '#000000';

      //下-文字
      if (v_or_h == 1) {
        //1竖写
        ctx.wrapText(
          name_score[i].name,
          i * this.HB + this.STH + 5,
          num_h * this.VB + this.STV + 20,
          10,
          15,
        );
      } else {
        //0横写
        ctx.fillText(
          name_score[i].name,
          i * this.HB + this.STH + 5,
          num_h * this.VB + this.STV + 20,
          this.HB - 20,
        );
      }

      //						ctx.wrapText(json[i].name,i*HB+STH+10,3*VB+STV+20,10,15);	//下-文字-竖排
      if (fix_score != null && fix_score[name_score[i].name] != undefined) {
        //			if(fix_score.indexOf([name_score[i].name]) > -1){
        ctx.fillText(fix_score[name_score[i].name], x - 5, 0 * this.VB + this.STV + 10); //上-数字
        ctx.fillText((fix_score[name_score[i].name] * 2) / 3, x - 5, 1 * this.VB + this.STV + 10); //中-数字
        ctx.fillText((fix_score[name_score[i].name] * 1) / 3, x - 5, 2 * this.VB + this.STV + 10); //下-数字
      }
    }

    if (name2 != null && v_or_h == 1) {
      var j = 0;
      for (var i = 0; i < Object.keys(name2).length; i++) {
        ctx.fillText(
          name2[i][0] + '(' + name2[i][1] + ')',
          j * this.HB + this.STH + 5,
          (num_h + 1) * this.VB + this.STV + 60,
          name2[i][1] * this.HB - 10,
        );
        j += name2[i][1];
      }
    }

    ctx.stroke();
    ctx.closePath();
  };

  /**
   * num_v 需要画的竖线的数量
   * num_h 需要画的横线的数量
   * name_score 需要显示的名称和得分
   * fix_score 固定的得分
   * */
  this.title = function (ctx, num_v, title) {
    ctx.beginPath();
    //		ctx.fillStyle = "#000000";	//文字颜色
    ctx.font = '18px Arial';
    ctx.fillText(title, (num_v * this.HB * 1) / 2 + this.STH - 80, this.STV - 30); //标题

    ctx.stroke();
    ctx.closePath();
  };
};

export default muban;
