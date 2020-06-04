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
    let date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
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
    let lastmodified = new Date();
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
      }
    });
    // const cloud = require('wx-server-sdk')
    // cloud.init()

    // const db = wx.cloud.database()
    // const _ = db.command
    // db.collection('weight').where({
    //   _id:this.data.id
    // }).update({
    //   // data 传入需要局部更新的数据
    //   data: {
    //     lastModifydate:lastmodified,
    //     weights:_.push(obj)
    //   },
    //   success: console.log,
    //   fail: console.error
    // })
    // exports.main = async (event, context) => {
    //   const { OPENID } = cloud.getWXContext()
    //   const userCollection = db.collection('weight')//选取collection
    //   const thisID = userCollection.where({ '_id': this.data.id })

    //   return thisID.get().then(res => {
    //     debugger
    //     let num1 = userCollection.add({
    //       data: {
    //         weights: _.push(obj)
    //       }
    //     })
    //     let num2 = thisID.update({
    //       data: {
    //         lastModifydate: lastmodified,
    //       }
    //     })
    //     return num1 + num2
    //   }
    //   )
    // }
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