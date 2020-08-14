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
    totalCurr: 0,//为了传递给修改页面
    expire: false,//是否过期
    plantype: '',
    type: '',
    datas: [],//所有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let finishedid = '463448e05ec9f402001d7920267731ed';
    let unfinishedid = '7bf6e49262e6c23fdc2c188439bf58d0';
    let planid = options.id ? options.id : unfinishedid;
    this.setData({
      id: planid,
    })
    this.getData();
  },
  deleteDetail(e) {//删除一条明细
    let detailid = e.currentTarget.dataset.detailid;
    let rWeight = e.currentTarget.dataset.rweight;
    let tips = '删除' + rWeight + '嘛？';
    let that = this;

    wx.showModal({
      title: '提示',
      content: tips,
      success(res) {
        if (res.confirm) {
          that.handleDeleteDetail(detailid, e.currentTarget.dataset.index);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }, handleDeleteDetail(detailidc, index) {

    let currId = this.data.id;
    //yxy add 20200617 TODO 更新totalCurr，done
    let datas = this.data.datas;
    let total = this.data.total;
    let totalCurr = this.data.totalCurr;

    let done = '0';
    if (this.data.type == '1') {
      //累加型
      totalCurr = this.data.totalCurr - Number(datas[index]);
      done = (totalCurr >= total) ? '1' : '0';
    } else if (this.data.type == '2') {
      //目标型
      if (datas.length > 1) {
        datas.splice(index, 1);
        totalCurr = datas[datas.length - 1];
      }
      if (this.data.plantype == 'add') {
        done = (totalCurr >= total) ? '1' : '0';
      } else if (this.data.plantype = 'cut') {
        done = (totalCurr <= total) ? '1' : '0';
      }
    }
    this.setData({
      datas: datas,
      totalCurr: totalCurr,
      done: done,
    })
    //数据库删除功能
    wx.cloud.callFunction({
      name: 'deletePlanDetail',
      data: {
        currId: currId,
        detailid: detailidc,
        totalCurr: totalCurr,
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
        let eve = resCurr.eve;
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
        let totalCurr = resCurr.totalCurr;
        let datas = [];
        arr.map((item) => {
          let datecurr = item.rdate.substr(5, item.rdate.length - 1);
          item.name = datecurr;
          item.value = item.rWeight;
          if(type=='1'){
            item.over = (item.rWeight > eve)? 1 : 0;
          }else if(type=='2'){
            item.over = (item.rWeight > total)? 1 : 0;
          }
          item.rWeight += unit;
          datas.push(item.value);
        })
        //最后合计部分,累计计划 目标计划
        let x = app.numSub(total, totalCurr);//最后记录和目标的差值
        if (type == '1') {
          unExe.name = "未实现";
          unExe.value = x;
          if (x < 0) {
            unExe.name = "超出目标";
            unExe.value *= -1;
          }
          unExe.rWeight = unExe.value + unit;
        } else if (type == '2') {
          //累加计划 x=目标-当前
          if (plantype == 'add') {
            unExe.name = x < 0 ? '已完成且超出' : '未完成还差';
          } else if (plantype = 'cut') {
            unExe.name = x > 0 ? '已完成且超出' : '未完成还差';
          }
          unExe.value = Math.abs(x) + unit;
          unExe.rWeight = Math.abs(unExe.value) + unit;
        }
        unExe.over = 0;
        arr.push(unExe);
        this.setData({
          weights: arr,
          remaindates: remaindates,
          total: resCurr.total,
          expire: expire,
          type: type,
          plantype: plantype,
          totalCurr: resCurr.totalCurr,
          datas: datas,
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
        + '&total=' + this.data.total + '&totalCurr=' + this.data.totalCurr + '&type=' + this.data.type
        + '&plantype=' + this.data.plantype
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