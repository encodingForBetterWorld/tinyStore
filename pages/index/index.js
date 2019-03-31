//index.js
//获取应用实例
const util = require("../../utils/util.js");
const app = getApp();

Page(
  app.identityFilter({
    data: {
      banners: [],
      goods:[],
      swiper_settings: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000
      }
    },
    onLoad: function () {
      
    },
    request: util.request,
    onShow: function(){
      var pageObj = this;
      pageObj.request({
        url: app.globalData.host + "index_data",
        success: res => {
          pageObj.setData({
            banners: res.data.data.banners,
            goodses: res.data.data.goodses
          })
        }
      });
    },
  })
)

