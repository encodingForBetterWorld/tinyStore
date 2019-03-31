const app = getApp();
module.exports = {
  touchStart: function (e) {
    this.setData({
      startX: e.touches[0].clientX,
      curr_section_idx: e.currentTarget.dataset['index']
    })
  },
  touchMove: function (e) {
    var touch = e.touches[0];
    var distX = this.data.startX - touch.clientX;
    if (distX >= 100) {
      this.setData({
        delete_id: this.data.list[this.data.curr_section_idx].id
      })
    } else if (distX <= -100) {
      if (this.data.list[this.data.curr_section_idx].id == this.data.delete_id) {
        this.setData({ delete_id: null })
      }
    }
  },
  singlePay: function (e) {
    let order_id = e.currentTarget.dataset.id;
    let idx = e.currentTarget.dataset.index;
    let page_type = e.currentTarget.dataset.type;
    let pageObj = this;
    let new_data = {
      "options.total_price": 0,
      "options.btn_text": null
    }
    if(page_type=="list"){
      let {orders} = pageObj.data;
      let order = orders[idx];
      pageObj.setData({
        orders: []
      });
      new_data["orders"] = orders;
      new_data["order_ids"] = [];
      new_data["checked_order_idxs"] = [];
    }
    pageObj.setData(new_data);
    pageObj.togglePayModal({
      status: "open",
      order_ids: [order_id]
    })
  },
  singleClose: function (e) {
    let order_id = e.currentTarget.dataset.id;
    let idx = e.currentTarget.dataset.index;
    let page_type = e.currentTarget.dataset.type;
    let pageObj = this;
    wx.showModal({
      title: '提示',
      content: '即将关闭订单',
      success(res) {
        if (res.confirm) {
          pageObj.request({
            url: app.globalData.host + 'order_edit',
            method: "POST",
            data: {
              status: 2,
              order_ids: [order_id]
            },
            success: res => {
              let new_data = {};
              if(page_type=="list"){
                let { orders } = pageObj.data;
                orders.splice(idx, 1);
                pageObj.setData({
                  "options.total_price": 0,
                  "options.btn_text": null,
                  orders: [],
                  order_ids: [],
                  checked_order_idxs: []
                });
                new_data["orders"] = orders;
              }else if(page_type=="detail"){
                new_data["status"] = 2
              }
              pageObj.setData(new_data);
              wx.showToast({
                title: '关闭订单成功',
                duration: 2000,
              })
            }
          });
        }
      }
    })
  },
}