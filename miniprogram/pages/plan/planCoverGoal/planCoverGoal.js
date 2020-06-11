// pages/plan/planCoverGoal.js
import * as echarts from '../../../components/ec-canvas/echarts';

const app = getApp();
var chart = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//planid
    ec: {
      lazyLoad: true
    },
    plan: {},
    title: '',
    subText: '',
    addpic: {
      mode: 'aspectFit',
      addpicurl: '/images/add.png',
      pulltoppicurl: '/images/pulltop.png'
    }, changeFlag: false,//修改标志 默认没改
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id ? options.id : '393b0bd2-8e2e-cf52-4e0d-d2afde96de55';
    this.setData({
      id: id
    })
    this.getData();
    this.chartsComponnet = this.selectComponent('#mychart-dom-bar'); //饼图
  },
  getData() {
    let id = this.data.id;
    let plan = {};

    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('weight').where({
      _id: this.data.id
    }).get({
      success: res => {
        let ressul = res.data[0];
        plan = ressul;
        let fz = Number(ressul.startnum) - Number(ressul.total);//目标-现在
        plan.eve = app.getDevided(fz, ressul.expect, 2, true)
        let xtitles = [];
        let datas = [];
        let weights = ressul.weights;
        let fromnow = app.getDaysFromNow(plan.createTime);
        let remaindates = plan.expect - fromnow;
        plan.remaindates = remaindates;
        let outofdate = (fromnow > plan.expect) ? true : false;//过期标志
        plan.outofdate = outofdate;
        weights.map(item => {
          let weight = item.rWeight;
          let xt = item.rdate;
          xtitles.push(xt);
          datas.push(weight);
        })
        //plantype add 递增类型
        //去最后一次记录
        let realizeFlag = true;
        let final = (datas.length > 0) ? datas[datas.length - 1] : plan.startnum;
        let diff = app.numSub(final, plan.total);
        //total startnum
        if (plan.plantype == 'add') {
          //递增 最后比目标大则为实现
          realizeFlag = (diff > 0) ? true : false;
        } else {
          realizeFlag = (diff < 0) ? true : false;
        }
        plan.diff = Math.abs(diff);
        plan.xtitles = xtitles;
        plan.datas = datas;
        plan.createTime = app.formateDate(plan.createTime);
        plan.realizeFlag = realizeFlag;
        let remaineve = 0;
        if (!outofdate && !realizeFlag) {
          //未实现,未到期
          remaineve = app.getDevided(diff, remaindates, 2, true);
          plan.remaineve = remaineve;
        }
        plan.fromnow = fromnow;
        this.setData({
          plan: plan,
          title: plan.title,
        });
        this.initChart();
      }
    })

  },
  titleChanged: function (e) {
    let ttitle = e.detail.value;
    if (ttitle == this.data.title) {
      return;
    }
    let that = this;
    wx.showModal({
      title: '',
      content: '重命名为"' + ttitle + '"？',
      success(res) {
        if (res.confirm) {
          that.setData({
            title: ttitle,
            changeFlag: true
          })
          that.submitChange();
        } else if (res.cancel) {
          that.setData({
            title: that.data.title
          })
        }
      }
    })

  }, initChart() {
    this.chartsComponnet.init((canvas, width, height, dpr) => {
      const thischart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      thischart.setOption(this.getOption(chart));
      return thischart;
    })
  },
  getOption: function () {
    let option = {
      title: {
        //text: '未来一周气温变化',
        subtext: this.data.plan.subText
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['changing']
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.data.plan.xtitles
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}' //+ this.data.plan.unit
          },
          min: 'dataMin',
          scale: true
        }
      ],
      series: [
        {
          name: 'changing',
          type: 'line',
          data: this.data.plan.datas,
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        },
      ]
    };

    return option;
  },
  record(e) {
    wx.navigateTo({
      url: '/pages/plan/addDetail/addDetail?id=' + this.data.id + '&createTime=' + this.data.plan.createTime + '&days=' + this.data.plan.days + '&eve=' + this.data.plan.eve + '&maxv=' + this.data.plan.total,
      complete: (res) => { },
      events: e,
      fail: (res) => { },
      success: (result) => { },
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
    wx.pageScrollTo({
      scrollTop: 0
    })
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
    wx.navigateTo({
      url: '/pages/plan/planHistory/planHistory?id=' + this.data.id,
      complete: (res) => { },
      fail: (res) => { },
      success: (result) => { },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  submitChange: function (e) {
    if (this.data.changeFlag) {
      const db = wx.cloud.database()
      db.collection('weight').doc(this.data.id).update({
        data: {
          title: this.data.title,
        }
      });
      wx.showToast({
        title: '成功',
        icon: 'success',
      })
    }
  }
})