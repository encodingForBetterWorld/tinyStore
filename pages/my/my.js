// pages/my/my.js
const util = require("../../utils/util.js");
const modal = require("../../common/templates/modal.js");
const btn = require("../../common/templates/btn.js");
const app = getApp();
Page(
  app.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    my_order_selections: [
      ["fa-wallet", "待付款"], ["fa-truck", "进行中"], ["fa-check-square-o", "已完成"], ["fa-trash-o", "已关闭"]
    ],
    header_order_status:0,
    orders:[],
    options: {
      total_price: 0,
      btn_text: null,
      bindtap: "groupPay"
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  togglePayModal: modal.togglePayModal,
  copyPrice: modal.copyPrice,
  previewQrcode: modal.previewQrcode,
  request: util.request,
  getStatus: function (status){
    switch (status) {
      case 0:
        status = 0;
        break;
      case 1:
        status = 4;
        break;
      default:
        status -= 1;
        break;
    }
    return status
  },
  tapOrderHeader: function(e){
    let {index} = e.currentTarget.dataset;
    let pageObj = this;
    let status = pageObj.getStatus(index);
    pageObj.request({
      url: app.globalData.host + 'order_list',
      data: {
        status: status
      },
      success: res => {
        pageObj.setData({
          orders: res.data.data,
          header_order_status: index,
          order_ids:[],
          "options.total_price": 0,
          "options.btn_text": null,
        })
      }
    })
  },
  groupPay: function(e){
    let order_ids = []
    let {orders} = this.data
    this.data.checked_order_idxs.forEach(idx=>{
      order_ids.push(orders[idx].id);
    });
    this.togglePayModal({
      status: "open",
      order_ids: order_ids
    })
  },
  singlePay: btn.singlePay,
  singleClose: btn.singleClose,
  checkOrderPay: function(e){
    let { orders } = this.data
    let total_price = 0;
    let checked_order_idxs = e.detail.value;
    checked_order_idxs.forEach(idx=>{
      let order = orders[idx];
      total_price += (order.total_price + order.freight);
    })
    let l = checked_order_idxs.length;
    let btn_text = null;
    if(l==1){
      btn_text = "去付款"
    }else if(l > 1){
      btn_text = "合并付款"
    }
    this.setData({
      "options.total_price": total_price,
      "options.btn_text": btn_text,
      checked_order_idxs: checked_order_idxs
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pageObj = this;
    pageObj.setData({
      orders: [],
      order_ids: [],
      "options.total_price": 0,
      "options.btn_text": null,
    })
    pageObj.request({
      url: app.globalData.host + 'order_list',
      data:{
        status: pageObj.getStatus(pageObj.data.header_order_status)
      },
      success: res => {
        pageObj.setData({
          orders: res.data.data
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
}));