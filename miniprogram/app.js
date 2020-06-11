//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  guid: function () {//自动生成id方法
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
  },
  addTime: function (date, x, f) {//日期加x天
    if (f === 'd') {
      console.log(date, '日期加了', x, 'days');
    } else if (f === 't') {//时间
    }
  },
  getDaysFromNow: function (date) {
    let now = new Date();
    let startDate = Date.parse(date);
    let endDate = Date.parse(now);
    let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return days.toFixed(1);
  },

  formateDate: function (date) {
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() == 0 ? "00" : date.getMinutes();
    var s = date.getSeconds();
    return Y + M + D + h + m;
  },
  getDevided: function (fz, fm, precis, abs) {
    let fin = (Number(fz) / Number(fm)).toFixed(precis)
    if (abs) {
      fin = Math.abs(fin);
    }
    return fin;
  },
  numSub: function (num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
  }
})
