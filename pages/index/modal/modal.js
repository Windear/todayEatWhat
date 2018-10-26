module.exports = {


  //获取点击菜品传过来的值
  getFoodContent(event) {

    console.log(event.target.dataset.index);
    this.setData({
      selectFood: event.target.dataset.index,
      showModalStatus: true
    })
  },

}