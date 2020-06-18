// pages/plan/addPlan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: '0',//TODO 展示页面 默认为0
    type: '1',//默认是添加类的
    titlename: '总值',//目标值对应type 1总值
    startTime: '',//计划开始时间
    endTime: '',//过期时间
    createTime: '',//创建时间
  },
  changeFlag(event) {
    let titlename = (event.target.dataset.type == '1') ? '总值' : '目标值';
    this.setData({
      showFlag: event.target.dataset.showflag,
      type: event.target.dataset.type,
      titlename: titlename
    })
  },
  returnPlan(e) {
    this.setData({
      showFlag: '0'
    })
  },
  formSubmit(e) {
    let formData = e.detail.value;
    formData.createTime = this.data.createTime;
    formData.startTime = this.data.startTime;
    formData.endTime = this.data.endTime;
    formData._id = app.guid();
    formData.weights = [];
    let expect = formData.expect;
    let total = Number(formData.total);
    let totalCurr = Number(formData.totalCurr);
    let totalUnRealize = (this.data.type == '1') ? total : (totalCurr - total);
    let eve = app.getDevided(totalUnRealize, expect, 2, true);
    let unit = formData.unit;
    formData.subText = '(' + expect + '*' + eve + unit + ')';
    formData.eve = eve;
    formData.total = Number(formData.total);
    if (this.data.type == '2') {
      let x = app.numSub(formData.total, formData.totalCurr);
      formData.plantype = (x > 0) ? 'add' : 'cut';
      formData.totalCurr = Number(formData.totalCurr);
    }
    const db = wx.cloud.database()
    db.collection('weight').add({
      data: formData
    })
      .then(res => {
        console.log(res)
      })
      .catch(console.error)
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000//持续的时间
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeDays(e) {
    let createTime = (this.data.createTime == '') ? (new Date()).getTime() : this.data.createTime;
    let startTime = createTime;
    let addDays = e.detail.value;
    let endTime = app.addTime(startTime, addDays, 'd');
    this.setData({
      createTime: createTime,
      startTime: startTime,
      endTime: endTime
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
    /*
    let pages = getCurrentPages();
    let last = pages[pages.length - 2];
    last.getDataList();
    */
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