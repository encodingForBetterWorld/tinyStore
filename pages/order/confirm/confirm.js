// pages/order/confirm/confirm.js
const util = require("../../../utils/util.js");
const modal = require("../../../common/templates/modal.js");
const picker = require("../../../common/templates/area-picker.js");
const section = require("../../../common/templates/section.js");
const app = getApp();
Page(
  app.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    options:{
      btn_text:"确认付款",
      bindtap:"submitOrder"
    },
    // 模态框数据
    showModalStatus: false,
    animationData: null,
    sectionIndex: 0,
    province_name_list: picker.province.map((n) => n.name),
    address_form:{},
    form:{},
  },
  pick_area: picker.pick_area,
  clear_area: picker.clear_area,
  toggleModal: modal.toggleModal,
  tapModalHeader: modal.tapModalHeader,
  tapModalConfirm: modal.tapModalConfirm,
  request: util.request,
  inputForm: function(e){    
    let data = {};
    data["form." + e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goods_types: options["goods_types"]
      });
  },
  submitOrder: function(e){
    let pageObj = this;
    if(pageObj.data.order_id){
      pageObj.togglePayModal({
        status: "open",
        order_id: pageObj.data.qrcode?null:pageObj.data.order_id
      })
      return
    }
    if (!pageObj.data.selected_address){
      pageObj.setData({
        sectionIndex: 1,
      })      
      pageObj.toggleModal("open")
    }else{
      // 提交订单数据
      pageObj.setData({
        "form.order_datas": pageObj.data.order_datas.map((n) => { return { id: n.id, count: n.count } }),
        "form.address_id": pageObj.data.selected_address.id
      })
      new Promise((resolve, reject)=>{
        pageObj.request({
          url: app.globalData.host + 'order_submit',
          method: "POST",
          data: pageObj.data.form,
          success: res => resolve(res)
        })
      }).then(res=>{
        let order_id = res.data.data.order_id;
        pageObj.setData({
          order_id: order_id,
          modal_disable: true
        });
        pageObj.togglePayModal({
          status: "open",
          order_ids: [order_id]
        })
      })
    }
  },
  changeAddressFrom: section.changeAddressFrom,
  checkAddress: modal.checkAddress,
  togglePayModal: modal.togglePayModal,
  copyPrice: modal.copyPrice,
  previewQrcode: modal.previewQrcode,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.request({
      url: app.globalData.host + 'order_confirm_data',
      data:{
        goods_types: this.data.goods_types
      },
      success: res =>{
        this.setData({
          addresses: res.data.data.addresses,
          order_datas: res.data.data.order_datas,
          freight: res.data.data.freight,
          total_count: res.data.data.total_count,
          total_price: res.data.data.total_price
        })
        if(this.data.addresses.length < 1){
          this.setData({
            sectionIndex: 1,
          })
          // 弹出添加地址页面
          this.toggleModal("open")
        }else{
          let selected_address = this.data.addresses[0];
          if(selected_address.is_default){
            this.setData({
              selected_address: selected_address
            })
          } 
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