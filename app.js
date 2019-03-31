//app.js
const util = require("utils/util.js")
App({
  onLaunch: function () {
    var app = this;
    this.globalData.promise = new Promise(function (resolve, reject) {
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
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    host: "https://app.33code.online/api/",
    assets_host:"https://app.33code.online/assets/tinystore/",
    promise: null,
    sessionid: wx.getStorageSync("sessionid")
  },
  identityFilter: function(pageObj){
    let appData = this.globalData;
    if (pageObj.onShow) {
      let _onShow = pageObj.onShow;
      pageObj.onShow = function () {
        appData.promise.then(() => {
          //跳转到登录页
          wx.redirectTo({
            url: "/pages/auth/auth"
          });
        }, () => {
          //获取页面实例，防止this劫持
          let pages = getCurrentPages();
          let currentInstance = pages[pages.length - 1];
          currentInstance.setData({
            sessionid: appData.sessionid,
            assets_host: appData.assets_host,
            host: appData.host
          });
          if (['pages/index/index', 'pages/my/my', 'pages/cart/cart'].indexOf(currentInstance.route) > -1){
            // 显示购物车提示
            let cart_count = util.cartCount();
            if (cart_count && cart_count > 0) {
              wx.setTabBarBadge({
                index: 1,
                text: cart_count + '',
              })
            }
          }
          _onShow.call(currentInstance);
        });
      }
    }
    return pageObj;
  }
})