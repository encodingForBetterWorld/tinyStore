// pages/cart/cart.js
const btn = require("../../common/templates/btn.js");
const util = require("../../utils/util.js");
const app = getApp()
Page(
  app.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    options:{
      bindtap: "creatOrder"
    },
    delete_id:null,
    startX:null,
    curr_section_idx:null,
  },
  touchStart: btn.touchStart,
  touchMove: btn.touchMove,
  request: util.request,
  creatOrder: function(e){
    // 跳转到确认订单页
    wx.navigateTo({
      url: "/pages/order/confirm/confirm?goods_types=" + JSON.stringify(this.data.selected_list)
    });
  },
  cartCountEdit: function(e){
    let pageObj = this;
    let type = e.currentTarget.dataset.type;
    let idx = e.currentTarget.dataset.index;
    let cart_id = e.currentTarget.dataset.id;
    let {list} = pageObj.data;
    let {selected_list} = pageObj.data;
    let totalPrice = pageObj.data.options.total_price;
    let cart_data = list[idx];
    let price_diff = 0;
    if (type == "add" && cart_data.select_count < cart_data.count){
      list[idx].select_count ++;
      price_diff += cart_data.price;
    }
    if (type == "sub" && cart_data.select_count > 1){
      list[idx].select_count --;
      price_diff -= cart_data.price;
    }
    let l = selected_list.length;
    while (l--) {
      if(cart_id==selected_list[l].id){
        totalPrice += price_diff;
        selected_list[l].count = cart_data.select_count;
        break;
      }
    }
    pageObj.setData({
      "options.total_price": totalPrice,
      list: list,
      selected_list: selected_list
    });
    util.cartAdd(cart_id, cart_data.select_count);
  },
  cartRemove: function (e) {
    let pageObj = this;
    wx.showModal({
      title: '提示',
      content: '即将移除购物车中商品',
      success: res => {
       if (res.confirm) {
         let idx = e.currentTarget.dataset.index;
         let cart_id = e.currentTarget.dataset.id;
         let { list } = pageObj.data;
         let { selected_list } = pageObj.data;
         let totalPrice = pageObj.data.options.total_price;
         let cart_data = list[idx];
         let price_diff = (cart_data.price * cart_data.select_count);
         let l = selected_list.length;
         while (l--) {
           if (cart_id == selected_list[l].id) {
             totalPrice -= price_diff;
             selected_list.splice(l, 1);
             break;
           }
         }
         list.splice(idx, 1);
         let new_data = {
           "options.total_price": totalPrice,
           list: list,
           selected_list: selected_list,
           delete_id: null
         }
         if (selected_list.length == 0) {
           new_data["options.btn_text"] = null
         }
         pageObj.setData({
           list:[]
         });
         pageObj.setData(new_data);
         util.cartRemove(cart_id);
         let cart_count = util.cartCount();
         if (cart_count && cart_count > 0){
           wx.setTabBarBadge({
             index: 1,
             text: '' + cart_count,
           })
         }else{
           wx.removeTabBarBadge({
             index: 1,
           })
         }
       }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  checkCartPay:function(e){
    let pageObj = this;
    let selected_list = [];
    let total_price = 0;
    e.detail.value.forEach(idx=>{
      idx = Number(idx);
      let cart_data = pageObj.data.list[idx];
      selected_list.push({
        id: cart_data.id,
        count: cart_data.select_count
      });
      total_price += cart_data.price * cart_data.select_count
    });
    let new_data = {
      "options.total_price": 0,
      "options.btn_text": null,
      selected_list: selected_list
    }
    if (selected_list.length > 0){
      new_data['options.total_price'] = total_price.toFixed(2);
      new_data['options.btn_text'] = "去结算";
    }
    pageObj.setData(new_data)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pageObj = this;
    let cart_keys = wx.getStorageSync("cart_keys");
    pageObj.setData({
      "options.total_price": 0,
      "options.btn_text": null,
      list: [],
      selected_list: []
    })
    if (cart_keys) {
      let cart_datas = [];
      cart_keys = JSON.parse(cart_keys);
      cart_keys.forEach(key => {
        cart_datas.push({
          id: key,
          count: wx.getStorageSync("cart_"+key)
        })
      })
      pageObj.request({
        url: pageObj.data.host + 'cart_list',
        data:{
          goods_types: cart_datas
        },
        success: res=>{
          pageObj.setData({
            list: res.data.data.cart_list
          });
        }
      })
    }
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
})
)