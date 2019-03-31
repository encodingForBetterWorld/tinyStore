// pages/settings/address/add/add.js
const picker = require("../../../../common/templates/area-picker.js"); 
const section = require("../../../../common/templates/section.js")
const util = require("../../../../utils/util.js");
const app =getApp();
Page(
  app.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    options:{
      btn_text:"添加",
      bindtap:"addAddress"
    },
    address_form: {},
    province_name_list: picker.province.map((n)=>n.name),
  },
  pick_area: picker.pick_area,
  clear_area: picker.clear_area,
  changeAddressFrom: section.changeAddressFrom,
  request:util.request,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  addAddress: function(e){
    let address_form = this.data.address_form;
    if (!util.isVaildAddressForm(address_form)) return;
    let pageObj = this;
    pageObj.request({
      url: app.globalData.host + "address_edit",
      method: "POST",
      data: address_form,
      success: res => {
        wx.showToast({
          title: '添加地址成功'
        });
        pageObj.clear_area();
        pageObj.setData({
          address_form: {}
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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