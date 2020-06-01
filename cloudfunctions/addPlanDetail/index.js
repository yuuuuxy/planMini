// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const res = await db.collection('weight').where({ _id: event.id}).update({
    data: {
      // lastModifydate: '123',
      lastModifydate: _.set(event.lastmodified),
      weights: _.push(event.obj)
    }
  });
  return {
    rees:res
  }
}