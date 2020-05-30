// pages/plan/plan/planCover.js
import * as echarts from '../../../components/ec-canvas/echarts';

const app = getApp();
var chart = "";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    weights: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getData()
    this.piechartsComponnet = this.selectComponent('#mychart-dom-bar'); //饼图

  },
  
  getOption: function () {
    return {
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
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
  },
      getData(){
      const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('weight').where({
        _openid: this.data.openid
      }).get({
        success: res => {
          let resu = res.data[0].weights;
          resu.map((item) => {
            let datecurr = item.rdate;
            item.name = datecurr.getFullYear() + '/' + datecurr.getMonth() + '/' + datecurr.getDate();
            item.value = item.rWeight;
          })
          this.setData({
            weights: resu
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