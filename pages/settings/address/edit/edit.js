// pages/settings/address/edit/edit.js
const picker = require("../../../../common/templates/area-picker.js");
const section = require("../../../../common/templates/section.js");
const util = require("../../../../utils/util.js");
const app = getApp();
Page(
  app.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    options: {
      btn_text: "确认",
      bindtap: "editAddress"
    },
    address_form: {},
    province_name_list: picker.province.map((n) => n.name),
  },
  pick_area: picker.pick_area,
  init_area: picker.init_area,
  changeAddressFrom: section.changeAddressFrom,
  request: util.request,
  editAddress: function(e){
    let address_form = this.data.address_form;
    if (!util.isVaildAddressForm(address_form)) return;
    let pageObj = this;
    wx.showModal({
      title: '提示',
      content: '即将修改收获地址',
      success: res => {
        if (res.confirm) {
          pageObj.request({
            url: app.globalData.host + "address_edit",
            method: "POST",
            data: address_form,
            success: res => {
              wx.showToast({
                title: '修改地址成功'
              });
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address_id: options.id
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
    let pageObj = this;
    pageObj.request({
      url: pageObj.data.host + "address_detail",
      data:{
        id: pageObj.data.address_id
      },
      success: res => {
        let address = res.data.data.address;
        pageObj.setData({
          address_form: address
        });
        pageObj.init_area(address.province, address.city, address.area);
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