// pages/settings/address/index.js
const btn = require("../../../common/templates/btn.js");
const util = require("../../../utils/util.js");
const app = getApp();
Page(
  app.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    delete_id: null,
    startX: null,
    curr_section_idx: null,
  },
  touchStart: btn.touchStart,
  touchMove: btn.touchMove,
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
  request: util.request,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pageObj = this;
    pageObj.request({
      url: pageObj.data.host + "address_list",
      success: res=>{
        pageObj.setData({
          list: res.data.data.addresses
        })
      }
    })
  },
  deleteAddress(e){
    let pageObj = this;
    let idx = e.currentTarget.dataset.index;
    let {list} = pageObj.data
    wx.showModal({
      title: '提示',
      content: '即将删除收获地址',
      success: res => {
        if (res.confirm) {
          pageObj.request({
            url: pageObj.data.host + 'address_edit',
            method: "POST",
            data: {
              id: pageObj.data.delete_id,
              is_showing: false
            },
            success: res => {
              list.splice(idx, 1);
              pageObj.setData({
                list: list,
                delete_id: null
              })
              wx.showToast({
                title: '删除地址成功',
              })
            }
          })
        }
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