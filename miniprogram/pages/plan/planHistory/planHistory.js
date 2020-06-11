// pages/plan/planHistory/planHistory.js
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
    remaindates: 0,//剩余时间
    total: 0,//为了传递给修改页面
    expire: false,//是否过期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let finishedid = '463448e05ec9f402001d7920267731ed';
    let unfinishedid = '90dbb4387d4c3bb308b72d3481b4ade2';
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
    }).orderBy('rdate', 'asc').get({
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
        let type = resCurr.type;//1累计 2目标
        let remaindates = (expect - Number(fromnow)).toFixed(1);
        let remaindate = (remaindates < 0) ? '过期' : remaindates;
        let expire = (remaindates < 0) ? true : false;
        let arr = resu;
        let final = total;
        arr.map((item) => {
          let datecurr = item.rdate.substr(5, item.rdate.length - 1);
          item.name = datecurr;
          item.value = item.rWeight;
          total -= item.value;
          item.rWeight += unit;
          final = item.value;
        })
        //最后合计部分,累计计划 目标计划
        if (type == '1') {
          unExe.name = "未实现";
          unExe.value = total;
          if (total < 0) {
            unExe.name = "超出目标";
            unExe.value *= -1;
          }
          unExe.rWeight = unExe.value + unit;
        } else if (type == '2') {
          //累加计划
          let startnum = resCurr.startnum;
          let x = app.numSub(final, resCurr.total);//最后记录和目标的差值
          if (plantype == 'add') {
            unExe.name = x > 0 ? '已完成且超出' : '未完成还差';
          } else if (plantype = 'cut') {
            unExe.name = x < 0 ? '已完成且超出' : '未完成还差';
          }
          unExe.value = Math.abs(x) + unit;
          unExe.rWeight = Math.abs(unExe.value) + unit;
        }
        arr.push(unExe);
        this.setData({
          weights: arr,
          remaindates: remaindates,
          total: resCurr.total,
          expire: expire
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
  showDetail: function (e) {
    let dataobj = e.currentTarget.dataset;
    let id = this.data.id;
    let maxv = this.data.total;
    const data = JSON.stringify(dataobj);
    wx.navigateTo({
      url: '/pages/plan/addDetail/addDetail?id=' + id + '&dataobj=' + data + '&maxv=' + maxv
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