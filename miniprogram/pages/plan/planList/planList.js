// pages/plan/planList/planList.js
function dataListFilter(item) {
  if (Number(item.total) >= 6300) {
    return true
  }
  return false
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ad: true,//显示广告封面
    lb: false,//显示左边菜单栏
    adm: 3,
    planList: [],
    addpic: {
      mode: 'aspectFit',
      text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应',
      addpicurl: '/images/add.png',
      deletepicurl: '/images/delete.png',
      ontopcurl: '/images/top_active.png',
      updatepicurl: '/images/edit.png',
      detailpicurl: '/images/detail.png',
      menupicurl:'/images/tips.png',
    },
    planCoverUrl: [
      '',
      '/pages/plan/planCover',
      '/pages/plan/planCoverGoal/planCoverGoal'
    ],
    multiArray: [['全部', '过期', '未过期'], ['全部', '已完成', '未完成']],
    multiIndex: [0, 0],
  },
  getDataList() {
    let expiresNum = this.data.multiIndex[0];//过期标志 0全部 1过期 2未过
    let completeNum = this.data.multiIndex[1];//完成标志
    const db = wx.cloud.database()
    const _ = db.command;
    let endTimeCmd = '';
    let query = {};
    query._openid = this.data.openid;
    if (!!expiresNum) {
      let now = (new Date()).getTime();
      switch (expiresNum) {
        case 1:
          endTimeCmd = _.lt(now)
          query.endTime = endTimeCmd
          break;
        case 2:
          endTimeCmd = _.gt(now)
          query.endTime = endTimeCmd
          break;
      }
    }

    let doneCmd = '';
    if (!!completeNum) {
      let now = (new Date()).getTime();
      switch (completeNum) {
        case 1:
          doneCmd = _.eq('1')
          query.done = doneCmd
          break;
        case 2:
          doneCmd = _.neq('1')
          query.done = doneCmd
          break;
      }
    }
    wx.showLoading({
      title: '在求数据..',
    })
    db.collection('weight').where(query)
      .orderBy('order', 'asc')
      .orderBy('createTime', 'asc').get({
        success: (res => {
          res.data.map((item) => {
            let editFlag = (item.weights.length > 0) ? false : true;
            item.editFlag = editFlag;
            return item;
          })
          this.setData({
            planList: res.data
          })
          wx.hideLoading()
        }),
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          wx.hideLoading()
          console.error('[数据库] [查询记录] 失败：', err)
        }

      })
  },
  showDetail(e) {
    let id = e.target.dataset.id;
    let type = e.target.dataset.type;
    let coverUrl = this.data.planCoverUrl[Number(type)];
    wx.navigateTo({
      url: coverUrl + '?id=' + id
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
      url: '/pages/plan/addPlan/addPlan',
    })
  },
  bindMultiPickerColumnChange(e) {
    let column = e.detail.column;
    let val = e.detail.value;
    let multiIndex = this.data.multiIndex
    multiIndex[column] = val;
  },
  bindMultiPickerChange(e) {
    let multiIndex = e.detail.value;
    this.setData({
      multiIndex: multiIndex
    });

    this.getDataList();
  },
  topPlan(e) {
    let planId = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'updatePlan',
      // 传递给云函数的参数
      data: {
        id: planId
      },
      success: res => {
        this.getDataList();
        // output: res.result === 3
      },
      fail: err => { },
      complete: () => { }
    })
  },
  toEdit(e) {
    let planId = e.currentTarget.dataset.id;
    let planType = e.currentTarget.dataset.type;
    let editFlag = e.currentTarget.dataset.editflag;
    wx.navigateTo({
      url: '/pages/plan/editPlan/editPlan?id=' + planId + '&type=' + planType + '&editFlag=' + editFlag,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let start = this.data.adm;
    let num = setInterval(function () {
      if (start <= 0) {
        clearInterval(num)
        that.setData({
          ad: false
        })
      }
      that.setData({
        adm: --start
      });
    }, 1000);
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
  , removeAd(e) {
    this.setData({
      ad: false
    })
  }
  ,showLeftBar(e){
    this.setData({
      lb: !this.data.lb
    })
  }
})