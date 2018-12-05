// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  let dbName = event.dbName; //数据库名称
  let filter = event.filter ? event.filter : null; //筛选条件，默认为空 如果为空，则返回全部数据
  let pageIndex = event.pageIndex ? event.pageIndex : 1; //当前第几页，默认第一页
  let pageSize = event.pageSize ? event.pageSize : 20; //每页取多少条数据，默认20条
  const countResult = await db.collection(dbName).where(filter).count(); //获取总记录数值
  const total = countResult.total; //得到总记录数
  //计算需要多少页
  const totalPage = Math.ceil(total / pageSize);
  let hasMore;//提示前端是否还有数据
  if (pageIndex > totalPage || pageIndex == totalPage) {//如果没有数据了就返回false
    hasMore = false
  } else {
    hasMore = true
  };

  //最后查询数据并返回给前端
  if (filter != null) {
    return db.collection(dbName)
      //where构建一个在当前集合上的查询条件，返回 Query，查询条件中可使用查询指令
      .where({
        //使用正则查询，实现对搜索的模糊查询
        tags: db.RegExp({
          //从搜索栏中获取的value作为规则进行匹配。
          regexp: filter,
          //大小写不区分
          options: 'i',
        }),
        // title: db.RegExp({
        //   //从搜索栏中获取的value作为规则进行匹配。
        //   regexp: filter,
        //   //大小写不区分
        //   options: 'i',
        // }),
        // imtro: db.RegExp({
        //   //从搜索栏中获取的value作为规则进行匹配。
        //   regexp: filter,
        //   //大小写不区分
        //   options: 'i',
        // }),
      })
      //skip指定查询时从命中的记录列表中的第几项之后开始返回
      .skip((pageIndex - 1) * pageSize)
      //limit指定返回数据的数量上限
      .limit(pageSize)
      //orderBy指定查询数据的排序方式
      .orderBy('id', 'desc')
      .get().then(res => {
        res.hasMore = hasMore;
        res.pageIndex = pageIndex;
        return res;
      });
  } else {
    //返回全部数据中的pageSize条
    return db.collection(dbName)
      .where()
      .limit(pageSize)
      .orderBy('id', 'desc')
      .get().then(res => {
        res.hasMore = hasMore;
        res.pageIndex = pageIndex;
        return res;
      });
  }

}