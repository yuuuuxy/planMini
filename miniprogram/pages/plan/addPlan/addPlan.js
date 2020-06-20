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
    date: '',//当前时间
    expect: 0,//结束时间（天）
    startDate: '',
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
    if (!this.validateNull(formData)) {
      wx.showToast({
        title: '有未填项',
        icon: 'none',
      })
    } else {
      formData.createTime = this.data.createTime;
      formData.startTime = this.data.startTime;
      formData.endTime = this.data.endTime;
      formData._id = app.guid();
      formData.weights = []; 
      let expect = this.data.expect;
      formData.expect = expect;
      let total = Number(formData.total);
      formData.totalCurr = Number(!formData.totalCurr ? 0 : formData.totalCurr);
      let totalCurr =formData.totalCurr;
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
        data: formData,
        success: function (res) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
          wx.navigateBack({delta: 1});
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
    let date = app.formateDate();
    this.setData({
      date: date.split(' ')[0],
      startDate: date
    })
  },
  dateChange(e) {
    let val = e.detail.value;
    let dateCh = new Date(val);
    let year = dateCh.getFullYear();
    let month = dateCh.getMonth();
    let day = dateCh.getDate();
    let createTime = (this.data.createTime == '') ? (new Date()).getTime() : this.data.createTime;
    let startTime = createTime;
    let endTime = new Date(createTime);
    endTime.setFullYear(year);
    endTime.setMonth(month);
    endTime.setDate(day);
    endTime = endTime.getTime();
    let expect = app.getDaysFromNow(startTime, endTime);
    this.setData({
      date: val,
      createTime: createTime,
      startTime: startTime,
      endTime: endTime,
      expect: parseInt(expect)
    })
  },
  changeDays(e) {
    let createTime = (this.data.createTime == '') ? (new Date()).getTime() : this.data.createTime;
    let startTime = createTime;
    let addDays = e.detail.value;
    let endTime = app.addTime(startTime, addDays, 'd');
    let date = app.formateDate(endTime);
    
    this.setData({
      createTime: createTime,
      startTime: startTime,
      endTime: endTime,
      date: date.split(' ')[0],
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