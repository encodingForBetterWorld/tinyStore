const modal = require("../../common/templates/modal.js")
//logs.js
// const util = require('../../utils/util.js')

// Page({
//   data: {
//     logs: [],
//     array:[1,2,3,4,5]
//   },
//   onLoad: function () {
//     this.setData({
//       logs: (wx.getStorageSync('logs') || []).map(log => {
//         return util.formatTime(new Date(log))
//       })
//     })
//   },
//   onShow:function(){
//     wx.previewImage({
//       current: '', // 当前显示图片的http链接
//       urls: ['https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI97SZd5Ew0nZaDic4zP5ry9303gw3E3deFOhEr7uHyicBx5xFJQBLOGFV1RicddVU0FddPdpWO1UNlA/132'] // 需要预览的图片http链接列表
//     })
//   }
// })
Page({
  data: {
    contents: '这是可以复制的文字,粘贴后即可看到效果'
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onShow: function(){
    this.togglePayModal({
      status: "open",
      order_id: 3
    })
  },
  togglePayModal:modal.togglePayModal,
  copyPrice: modal.copyPrice
})