// pages/plan/planCover.js
import * as echarts from '../../components/ec-canvas/echarts';

const app = getApp();
var chart = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    ec: {
      lazyLoad: true
    },
    weights: [
    ],//图表和列表展示数据
    type: '1',//1 add汇总类需要有未完成部分和溢出部分
    days: 0,
    eve: 0,
    eveforecast: 0,//日均预估
    unit: '',
    createTime: '',
    total: 0,
    remaindate: 0,
    remaindates: 0,//距离过期天数，复数代表已经过期
    addpic: {
      mode: 'aspectFit',
      addpicurl: '/images/add.png',
      pulltoppicurl: '/images/pulltop.png'
    },
    overWeight: 0,//超出目标值
    state: '1',//1.未超出，2.已经超出计划
    changeFlag: false,
    subTitle: '',//副标题
    title: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let finishedid = '463448e05ec9f402001d7920267731ed';
    let unfinishedid = '20c07e92-1622-3e6f-0aa2-abb091072e71';
    let id = options.id ? options.id : unfinishedid;
    this.setData({
      id: id
    })
    this.getData()
    this.piechartsComponnet = this.selectComponent('#mychart-dom-bar'); //饼图
  },

  getOption: function () {
    return {
      title: {
        // text: '南丁格尔玫瑰图',
        subtext: this.data.subTitle,
        x: 'center'
      },
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
      graphic: {       //图形中间文字
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: this.data.remaindate,
          textAlign: "center",
          fill: "#cecece",
          fontSize: 40
        }
      },
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: this.data.weights
      }]
    }
  },
  initChart() {
    this.piechartsComponnet.init((canvas, width, height, dpr) => {
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      pieChart.setOption(this.getOption(chart));
      return pieChart;
    })
  }, record(e) {
    wx.navigateTo({
      url: '/pages/plan/addDetail/addDetail?id=' + this.data.id + '&createTime=' + this.data.createTime + '&days=' + this.data.days + '&eve=' + this.data.eve + '&maxv=' + this.data.total,
      complete: (res) => { },
      events: e,
      fail: (res) => { },
      success: (result) => { },
    })
  },
  getData() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('weight').where({
      _id: this.data.id
    }).get({
      success: res => {
        let resCurr = res.data[0];
        let resu = resCurr.weights;
        let unExe = {};
        let total = resCurr.total;
        let plantype = resCurr.plantype;
        let unit = resCurr.unit ? resCurr.unit : '';
        let createTime = resCurr.createTime;
        let fromnow = app.getDaysFromNow(createTime);
        let expect = resCurr.expect;
        let remaindates = (expect - Number(fromnow)).toFixed(1);//剩余天数
        let remaindate = (remaindates < 0) ? '过期' : remaindates;
        let arr = resu;
        let state = this.data.state;

        arr.map((item) => {
          let datecurr = item.rdate.substr(5, item.rdate.length - 1);
          item.name = datecurr;
          item.value = item.rWeight;
          total -= item.value;
          item.rWeight += unit;
        })
        unExe.name = "未实现";
        unExe.value = total;
        let eveforecast = (Number(total) / Number(remaindates)).toFixed(2) + unit;
        let overWeight = 0;
        if (total < 0) {
          unExe.name = "超出目标";
          unExe.value *= -1;
          state = '2';
          overWeight = unExe.value;
        }
        unExe.rWeight = unExe.value + unit;
        arr.push(unExe);
        createTime = app.formateDate(createTime);
        let eve = (resCurr.total / resCurr.expect).toFixed(2);
        let subTitle = '(' + resCurr.expect + '*' + eve + unit + ')';
        this.setData({
          weights: arr,
          type: plantype,
          title: resCurr.title,
          days: resCurr.expect,
          eve: eve,
          unit: unit,
          createTime: createTime,
          total: resCurr.total,
          remaindate: remaindate,
          remaindates: remaindates,
          eveforecast: eveforecast,
          overWeight: overWeight,
          state: state,
          subTitle: subTitle,
        })
        this.initChart();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.submitChange();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.submitChange();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.navigateTo({
      url: '/pages/plan/planHistory/planHistory?id=' + this.data.id,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  titleChanged: function (e) {
    let ttitle = e.detail.value;
    if (ttitle == this.data.title) {
      return;
    }
    let that = this;
    wx.showModal({
      title: '',
      content: '重命名为"' + ttitle + '"？',
      success(res) {
        if (res.confirm) {
          that.setData({
            title: ttitle,
            changeFlag: true
          })
        } else if (res.cancel) {
          that.setData({
            title: that.data.title
          })
        }
      }
    })

  },
  submitChange: function (e) {
    if (this.data.changeFlag) {
      const db = wx.cloud.database()
      db.collection('weight').doc(this.data.id).update({
        data: {
          title: this.data.title,
        }
      });
    }
  }
})