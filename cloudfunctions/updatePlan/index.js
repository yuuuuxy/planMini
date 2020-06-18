// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id;
  const wxContext = cloud.getWXContext();
  let openid = wxContext.OPENID;
  const res = await db.collection('weight').where({
    _openid: openid
  }).update({
    data: {
      order: _.inc(1),
    }
  });
  const res1 = await db.collection('weight').doc(id).update({
    data: {
      order: 1,
    }
  });
  const res2 = await db.collection('weight').where({}).get();
  return {
    res2
  }
}