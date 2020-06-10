// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id;
  const res1 = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'deletePlanDetail',
    data: {
      currId: id,
      detailid: event.obj.detailid,
    }
  })
  const res = await db.collection('weight').doc(id).update({
    data: {
      lastModifydate: _.set(event.lastmodified),
      weights: _.push({
        each:[event.obj],
        sort: {
          rdate: 1,
        }
      })
    }
  });
  return {
    rees: res
  }
}