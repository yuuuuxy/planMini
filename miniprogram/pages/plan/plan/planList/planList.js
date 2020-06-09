// pages/plan/plan/planList/planList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: [],
    addpic: {
      mode: 'aspectFit',
      text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应',
      addpicurl: '/images/add.png',
      deletepicurl: '/images/delete.png'
    }
  },
  getDataList() {
    const db = wx.cloud.database()
    db.collection('weight').where({
      _openid: this.data.openid
    }).get({
      success: (res => {
        this.setData({
          planList: res.data
        })
      }),
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }

    })
  },
  showDetail(e) {
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/plan/plan/planCover?id=' + id
    })
  },
  deletePlan(e) {
    let that = this;
    let info = e.currentTarget.dataset;
    let id = info.id;
    let title = info.plan;
    let tips = '删除"' + title + '"嘛？';
    wx.showModal({
      title: '提示',
      content: tips,
      success(res) {
        if (res.confirm) {
          that.handleDeletePlan(id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleDeletePlan(id) {
    let that = this;
    //数据库删除操作
    const db = wx.cloud.database()
    db.collection('weight').doc(id).remove()
      .then(that.getDataList)
      .catch(console.error)
  },
  toAdd(e) {
    wx.navigateTo({
      url: '/pages/plan/plan/addPlan/addPlan',
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
    this.getDataList();
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
    this.getDataList()
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