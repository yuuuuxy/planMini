// pages/plan/plan/addDetail/addDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let now = new Date();
    let month = (now.getMonth() + 1);
    month = month > 10 ? month : '0' + month;
    let dat = now.getDate();
    dat = dat > 10 ? dat : '0' + dat;
    let date = now.getFullYear() + '-' + month + '-' + dat;
    let time = now.getHours() + ":" + now.getMinutes();
    this.setData({
      id: id,
      time: time,
      date: date,
      eve: options.eve,
      maxv: options.maxv,
      weightVal: undefined
    })
  }, weightChange(e) {
    let val = e.detail.value;
    this.setData({
      weightVal: val
    })
  }, dateChange(e) {
    let val = e.detail.value;
    this.setData({
      date: val
    })
  }, timeChange(e) {
    let val = e.detail.value;
    this.setData({
      time: val
    })
  },
  saveDetail(e) {
    let lastmodified = new Date().getTime();
    let formData = e.detail.value;
    let obj = {}
    obj.rWeight = formData.rWeight;
    obj.rdate = this.data.date;
    obj.rtime = this.data.time;
    obj.detailid = app.guid();

    wx.cloud.callFunction({
      name: 'addPlanDetail',
      data: {
        id: this.data.id,
        obj: obj,
        lastmodified: lastmodified
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: err => {
        console.log(err)
        // handle error
      },
      complete: () => {
        // ...
      }
    });
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
    let pages = getCurrentPages(); //页面栈
    let beforePage = pages[pages.length - 2];
    beforePage.getData()
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

  }
})