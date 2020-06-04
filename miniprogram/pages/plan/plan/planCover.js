// pages/plan/plan/planCover.js
import * as echarts from '../../../components/ec-canvas/echarts';

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
    unit: '',
    createTime: '',
    total: 0,
    remaindate: 0,
    addpic: {
      mode: 'aspectFit',
      text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应',
      addpicurl: '/images/add.png',
      deletepicurl: '/images/delete2.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id ? options.id : '463448e05ec9f402001d7920267731ed';
    this.setData({
      id: id
    })
    this.getData()
    this.piechartsComponnet = this.selectComponent('#mychart-dom-bar'); //饼图
  },

  getOption: function () {
    return {
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
          fontSize: 60
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
      url: '/pages/plan/plan/addDetail/addDetail?id=' + this.data.id + '&createTime=' + this.data.createTime + '&days=' + this.data.days + '&eve=' + this.data.eve + '&maxv=' + this.data.total,
      complete: (res) => { },
      events: e,
      fail: (res) => { },
      success: (result) => { },
    })
  }, deleteDetail(e) {//删除一条明细
    let detailid = e.currentTarget.dataset.detailid;
    let tips = '删除这条嘛？';
    let that = this;
    wx.showModal({
      title: '提示',
      content: tips,
      success(res) {
        if (res.confirm) {
          that.handleDeleteDetail(detailid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }, handleDeleteDetail(id) {
    //数据库删除功能
    wx.showToast({
      icon: 'none',
      title: '删除成功' + id
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
        let unit = resCurr.unit;
        let createTime = resCurr.createTime;
        let fromnow = app.getDaysFromNow(createTime);
        let expect = resCurr.expect;
        let remaindate = (expect - Number(fromnow)).toFixed(1);
        resu.map((item) => {
          let datecurr = item.rdate + ' ' + item.rtime;
          item.name = datecurr;
          item.value = item.rWeight;
          total -= item.value;
          item.rWeight += unit;
        })
        unExe.name = "未实现";
        unExe.value = total;
        if (total < 0) {
          unExe.name = "超出目标";
          unExe.value *= -1;
        }
        unExe.rWeight = unExe.value + unit;
        resu.push(unExe)
        this.setData({
          weights: resu,
          type: plantype,
          title: resCurr.title,
          days: resCurr.expect,
          eve: resCurr.total / resCurr.expect,
          unit: unit,
          createTime: createTime,
          total: resCurr.total,
          remaindate: remaindate
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})