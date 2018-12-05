// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let id = parseInt(event.id);
  return db.collection("foodDetails")
    .where({
      id:id
    })
    .get().then(res => {
      res.id = id;
      return res;
    });
}