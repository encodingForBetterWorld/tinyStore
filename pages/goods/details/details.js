// pages/goods/details/details.js
const modal = require("../../../common/templates/modal.js");
const util = require("../../../utils/util.js");
const app = getApp();
Page(app.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    goods:null,
    // 模态框数据
    showModalStatus: false,
    animationData: null,
    goods_types: [],
    curr_goods_type_idx: 0,
    curr_goods_type: {},
    goods_type_count: 1
  },
  toggleModal: modal.toggleModal,
  selectGoodsType: function (e) {
    let idx = e.currentTarget.dataset['index'];
    this.setData({
      curr_goods_type_idx: idx,
      curr_goods_type: this.data.goods_types[idx],
      goods_type_count: 1
    });
  },
  inputGoodsTypeCount: function(e){
    let count = e.detail.value;
    let max_count = this.data.curr_goods_type.count;
    if (isNaN(count)){
      count = 1;
    }else{
      count = Number(count);
      if (count < 1){
        count = 1
      }else if (count > max_count){
        count = max_count
      }
    }
    this.setData({
      goods_type_count: count
    })
  },
  goodsTypeCount: function (e) {
    let c_type = e.currentTarget.dataset.type;
    let max_count = this.data.curr_goods_type.count;
    let goods_type_count = this.data.goods_type_count;
    if (c_type == "add" && goods_type_count < max_count){
      this.setData({
        goods_type_count: goods_type_count + 1
      })
    }
    if (c_type == "sub" && goods_type_count > 1) {
      this.setData({
        goods_type_count: goods_type_count - 1
      })
    }
  },
  confirm: function(e){
    let c_type = this.data.showModalType
    if(c_type == "pay"){
      // 跳转到确认订单页
      wx.navigateTo({
        url: "/pages/order/confirm/confirm?goods_types=" + JSON.stringify([{
          id: this.data.curr_goods_type.id,
          count: this.data.goods_type_count
        }])
      })
    }else if(c_type == "cart"){
      // 添加到购物车
      util.cartAdd(this.data.curr_goods_type.id, this.data.goods_type_count);
      wx.showToast({
        title: '成功添加至购物车',
      });
    }
    this.toggleModal("close")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goods_id: options["goods_id"]
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  request: util.request,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pageObj = this;
    pageObj.request({
      url: app.globalData.host + "goods_detail",
      data:{
        goods_id: pageObj.data.goods_id
      },
      success: res => { 
        pageObj.setData({
          goods: res.data.data.goods,
          goods_types: res.data.data.goods_types,
          curr_goods_type: res.data.data.goods_types[0],
          curr_goods_type_idx:0,
          goods_type_count:1
        });
        let n_title = pageObj.data.goods.name;
        wx.setNavigationBarTitle({
          title: n_title.length > 9 ? n_title.substr(0, 9)+"..." : n_title
        })
      }      
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))