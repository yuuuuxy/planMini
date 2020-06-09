// pages/plan/plan/planHistory/planHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addpic: {
      mode: 'aspectFit',
      addpicurl: '/images/add.png',
      pulltoppicurl: '/images/pulltop.png',
      deletepicurl: '/images/delete2.png'
    },
    weights: [],
    id: '',//计划id
    remaindates: 0//剩余时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let finishedid = '463448e05ec9f402001d7920267731ed';
    let unfinishedid = '20c07e92-1622-3e6f-0aa2-abb091072e71';
    let planid = options.id ? options.id : unfinishedid;
    this.setData({
      id: planid,
    })
    this.getData();
  }, deleteDetail(e) {//删除一条明细
    let detailid = e.currentTarget.dataset.detailid;
    let rWeight = e.currentTarget.dataset.rweight;
    let tips = '删除' + rWeight + '嘛？';
    let that = this;
    wx.showModal({
      title: '提示',
      content: tips,
      success(res) {
        if (res.confirm) {
          that.handleDeleteDetail(detailid, rWeight);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }, handleDeleteDetail(detailidc, rWeight) {
    let currId = this.data.id;
    //数据库删除功能
    wx.cloud.callFunction({
      name: 'deletePlanDetail',
      data: {
        currId: currId,
        detailid: detailidc,
      },
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.refreshLastPageData()
      }
    });
  },
  refreshLastPageData() {
    this.getData()
  }, getData() {
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
        let remaindates = (expect - Number(fromnow)).toFixed(1);
        let remaindate = (remaindates < 0) ? '过期' : remaindates;
        let arr = resu;
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
        if (total < 0) {
          unExe.name = "超出目标";
          unExe.value *= -1;
        }
        unExe.rWeight = unExe.value + unit;
        let overWeight = unExe.rWeight;
        arr.push(unExe);
        this.setData({
          weights: arr,
          remaindates: remaindates
        })
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
    let pages = getCurrentPages();
    let lastPage = pages[pages.length - 2];
    lastPage.getData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.navigateBack({
      delta: 1
    })
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