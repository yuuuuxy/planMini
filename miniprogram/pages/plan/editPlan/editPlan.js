// pages/plan/addPlan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//planid
    type: '1',//默认是添加类的
    titlename: '总值',//目标值对应type 1总值
    startTime: '',//计划开始时间
    startTimeShow: '',//展示的部分
    endTimeShow: '',
    endTime: '',//过期时间
    date: '',//当前时间
    expect: 0,//结束时间（天）
    startDate: '',
    title: '',
    total: 0,
    totalCurr: 0,
    unit: '',
    editFlag: false
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

    wx.navigateBack({ delta: 1 });

  },
  formSubmit(e) {
    let formData = e.detail.value;
    if (!this.validateNull(formData)) {
      wx.showToast({
        title: '有未填项',
        icon: 'none',
      })
    } else {
      formData.startTime = this.data.startTime;
      formData.endTime = this.data.endTime;
      formData.weights = [];
      let expect = this.data.expect;
      formData.expect = expect;
      let total = Number(formData.total);
      formData.totalCurr = Number(!formData.totalCurr ? 0 : formData.totalCurr);
      let totalCurr = formData.totalCurr;
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
      db.collection('weight').doc(this.data.id).update({
        data: formData,
        success: function (res) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
          wx.navigateBack({ delta: 1 });
        },
        fail: (error => {
          wx.showToast({
            title: '保存失败了~',
            icon: 'none',
          })
        }),
        complete: console.log
      })

    }
  },
  validateNull(data) {
    for (let item in data) {
      if ('unit' === item) {
        continue;
      }
      if ('expect' === item && (data[item] == '0' || data[item] == 0)) {
        return false;
      }
      if ('' == data[item]) {
        return false;
      }
    }
    return true;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let planId = options.id;
    let planType = options.type;
    let editFlag = (options.editFlag == 'true') ? true : false;
    this.setData({
      id: planId,
      type: options.type,//默认是累加类的,2 是目标类
      editFlag: editFlag,
    })
    this.getData()
    this.piechartsComponnet = this.selectComponent('#mychart-dom-bar'); //饼图
  },
  getData() {
    wx.showLoading({
      title: '加载中..',
    });
    let id = this.data.id;
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('weight').where({
      _id: this.data.id
    }).field({
      weights: false,
    }).get({
      success: res => {
        let planMsg = res.data[0];
        let startTimeShow = app.formateDate(planMsg.startTime).split(' ')[0];
        let endTimeShow = app.formateDate(planMsg.endTime).split(' ')[0];
        this.setData({
          title: planMsg.title,
          total: planMsg.total,
          totalCurr: planMsg.totalCurr,
          unit: planMsg.unit,
          startTime: planMsg.startTime,
          startTimeShow: startTimeShow,
          endTime: planMsg.endTime,
          endTimeShow: endTimeShow,
          expect: planMsg.expect,
        })
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  dateChange(e) {

    let picker = e.currentTarget.dataset.type;
    let val = e.detail.value;
    let dateCh = new Date(val);
    let year = dateCh.getFullYear();
    let month = dateCh.getMonth();
    let day = dateCh.getDate();
    let startTime = this.data.startTime;
    let startTimeShow;
    let endTime = this.data.endTime;
    let endTimeShow;
    if (picker == 's') {//开始时间改变
      startTime = new Date(endTime);
      startTime.setFullYear(year);
      startTime.setMonth(month);
      startTime.setDate(day);
      startTime = startTime.getTime();
      endTime = this.data.endTime;
      endTimeShow = this.data.endTimeShow;
      startTimeShow = val;
    } else {
      let endTime = new Date(startTime);
      endTime.setFullYear(year);
      endTime.setMonth(month);
      endTime.setDate(day);
      endTime = endTime.getTime();
      startTime = this.data.startTime;
      startTimeShow = this.data.startTimeShow;
      endTimeShow = val;
    }
    let expect = app.getDaysFromNow(startTime, endTime);
    this.setData({
      date: val,
      startTime: startTime,
      endTime: endTime,
      expect: parseInt(expect),
      startTimeShow: startTimeShow,
      endTimeShow: endTimeShow
    })
  },
  changeDays(e) {

    let startTime = this.data.startTime;
    let addDays = e.detail.value;
    let endTime = app.addTime(startTime, addDays, 'd');
    let date = app.formateDate(endTime);
    this.setData({
      startTime: startTime,
      endTime: endTime,
      endTimeShow: date.split(' ')[0],
      expect: Number(addDays),
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