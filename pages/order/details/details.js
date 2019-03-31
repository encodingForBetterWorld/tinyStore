// pages/order/details/details.js
const util = require("../../../utils/util.js");
const btn = require("../../../common/templates/btn.js");
const modal = require("../../../common/templates/modal.js");
const app = getApp();
Page(
  app.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options["id"]
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  request: util.request,
  togglePayModal: modal.togglePayModal,
  copyPrice: modal.copyPrice,
  previewQrcode: modal.previewQrcode,
  singleClose: btn.singleClose,
  singlePay: btn.singlePay,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pageObj = this;
    pageObj.request({
      url: pageObj.data.host + 'order_detail',
      data:{
        id: pageObj.data.order_id
      },
      success: res => {
        if (res.data.data.expresstrace_set instanceof Array){
          res.data.data["expresstrace_set"] = res.data.data.expresstrace_set.sort((i1, i2)=>{
            if(i1.time<i2.time)return 1;
            else if (i1.time > i2.time)return -1;
            else return 0;
          });
        }
        pageObj.setData(res.data.data);
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