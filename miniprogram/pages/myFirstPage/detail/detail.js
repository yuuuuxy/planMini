// pages/myFirstPage/detail/detail.js
Page({
  back: function (event) {
    var pages = getCurrentPages();
    debugger
  },
  /**
   * 页面的初始数据
   */
  data: {
    calendarConfig: {
      // 配置内置主题
      theme: 'elegant'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const db = wx.cloud.database()//
    db.collection('weight').where({
     name:'manman'
    }).get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
      }
    })

    const weight = db.collection('weight')
    // const todo = db.collection('weight')
    //   .get({
    //     success: function (res) {
    //       // res.data 包含该记录的数据
    //       debugger
    //       console.log(res.data)
    //     },
    //   })
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

  }
})