// pages/plan/plan/addPlan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: '1'//展示页面
  },
  changeFlag(event) {
    this.setData({
      showFlag: event.target.dataset.showflag
    })
  },
  formSubmit(e) {
    let formData = e.detail.value;
    let createTime = new Date();
    console.log(createTime)
    console.log(formData)
    formData.createTime = createTime;
    formData._id = app.guid();
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
    let pages = getCurrentPages();
    let last = pages[pages.length - 2];
    last.getDataList();
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