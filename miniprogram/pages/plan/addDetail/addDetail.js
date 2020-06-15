// pages/plan/addDetail/addDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    updateFlag: false,//默认是增加
    detailid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let updateFlag = false;
    let date = '';
    let time = '';
    let weightVal = undefined;
    let maxv = 0;
    let eveforecast = 0;
    maxv = options.maxv;
    let detailid = '';
    let nowHolder = '';
    let type = options.type;
    if (!!options.dataobj) {//修改方法
      let dataobj = JSON.parse(options.dataobj);
      date = dataobj.date;
      time = dataobj.time;
      weightVal = dataobj.value;
      detailid = dataobj.detailid;
      updateFlag = true;
    } else {
      eveforecast = options.eveforecast;
      let lastadd = options.lastadd;
      let now = new Date();
      let month = (now.getMonth() + 1);
      month = month > 9 ? month : '0' + month;
      let dat = now.getDate();
      dat = dat > 9 ? dat : '0' + dat;
      date = now.getFullYear() + '-' + month + '-' + dat;
      time = now.getHours() + ":" + now.getMinutes();
      nowHolder = (type == '1') ? '预期每天的均值是' + eveforecast + '幺~' : '上次记录是' + lastadd + '幺~';
    }

    this.setData({
      id: id,
      time: time,
      date: date,
      eveforecast: eveforecast,
      maxv: maxv,
      weightVal: weightVal,
      updateFlag: updateFlag,
      detailid: detailid,
      nowHolder: nowHolder
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
    let lastmodified = new Date().getTime();
    let formData = e.detail.value;
    let obj = {}
    obj.rWeight = formData.rWeight;
    obj.rdate = this.data.date;
    obj.rtime = this.data.time;
    obj.detailid = (this.data.updateFlag) ? this.data.detailid : app.guid();
    wx.cloud.callFunction({
      name: 'addPlanDetail',
      data: {
        id: this.data.id,
        obj: obj,
        lastmodified: lastmodified
      },
      success: res => {
        wx.showToast({
          title: (this.data.updateFlag) ? '修改成功' : '添加成功',
        })
      },
      fail: err => {
        console.log(err)
        // handle error
      },
      complete: () => {
        // ...
      }
    });
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