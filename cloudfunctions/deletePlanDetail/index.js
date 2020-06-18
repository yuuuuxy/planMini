// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.currId;
  let detailidc = event.detailid;
  const res = await db.collection('weight').doc(id).update({
    data: {
      weights: _.pull({
        detailid: detailidc
      }),
      done: event.done,
      totalCurr: event.totalCurr,
    }
  });
  return {
    res
  }
}