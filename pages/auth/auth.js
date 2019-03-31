// pages/auth/auth.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
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

  },
  bindGetUserInfo: function (e) {
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          let post_data = Object.assign({}, userInfo);
          post_data["code"] = res.code;
          console.log(app.globalData.host + 'auth')
          wx.request({
            url: app.globalData.host + 'auth',
            method: "POST",
            data: post_data,
            success(_res){
              if(!_res.data["status"]){
                let _sessionid = _res.header["Set-Cookie"];
                wx.setStorageSync("sessionid", _res.header["Set-Cookie"]);
                app.globalData.userInfo = userInfo;
                app.globalData.sessionid = _sessionid;
                app.globalData.promise = new Promise(function (resolve, reject) {
                  wx.checkSession({
                    success() {
                      // session_key 未过期，并且在本生命周期一直有效
                      reject()
                    },
                    fail() {
                      // session_key 已经失效，需要重新执行登录流程
                      resolve()
                    }
                  })
                });
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }else{

              }
            }
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再次尝试',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})