const app = getApp();
const util = require('../../utils/util.js');
module.exports = {
  toggleModal: function (e) {
    // 弹出模态框
    let currentStatus, currentType;
    if (typeof e == "string"){
      currentStatus = e
    }else{
      currentStatus = e.currentTarget.dataset.status;
      currentType = e.currentTarget.dataset.type;
    }
    if (currentStatus == "open" && this.data.modal_disable) return;
    if(currentType){
      this.setData({
        showModalType: currentType
      });
    }
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).top("100%").step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).top("0").step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatus == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatus == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  togglePayModal: function (e) {
    // 弹出支付模态框
    let currentStatus, order_ids;
    if (e.hasOwnProperty("currentTarget")){
      currentStatus = e.currentTarget.dataset.status;
      order_ids = e.currentTarget.dataset.id;
    }else{
      currentStatus = e.status;
      order_ids = e.order_ids;
    }
    if(order_ids && !(order_ids instanceof Array)){
      order_ids = [order_ids]
    }   
    let p;
    let pageObj = this;
    if (order_ids && currentStatus == "open"){
      p = new Promise((resolve, reject)=>{
        pageObj.request({
          url: app.globalData.host + "qrcode_data",
          data: {
            order_ids: JSON.stringify(order_ids)
          },
          success: res => {
            pageObj.setData({
              qrcode: res.data.data.qrcode,
              qrcode_price: res.data.data.qrcode_price,
              order_ids: order_ids
            })
            resolve(res)
          }
        })
      })
    }
    let fn = function(){
      /* 动画部分 */
      // 第1步：创建动画实例 
      let animation = wx.createAnimation({
        duration: 200,  //动画时长
        timingFunction: "linear", //线性
        delay: 0  //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      pageObj.animation = animation;

      // 第3步：执行第一组动画
      animation.opacity(0).top("100%").step();

      // 第4步：导出动画对象赋给数据对象储存
      pageObj.setData({
        animationDataPay: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        // 执行第二组动画
        animation.opacity(1).top("10%").step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        pageObj.setData({
          animationDataPay: animation
        })

        //关闭
        if (currentStatus == "close") {
          pageObj.setData(
            {
              showModalPayStatus: false
            }
          );
        }
      }.bind(pageObj), 200)

      // 显示
      if (currentStatus == "open") {
        pageObj.setData(
          {
            showModalPayStatus: true
          }
        );
      }
    }
    p?p.then(fn):fn()
  },
  tapModalHeader: function(e){
    var currentIndex = e.currentTarget.dataset.index;
    this.setData({
      sectionIndex: Number(currentIndex)
    })
  },
  tapModalConfirm: function (e) {
    let pageObj = this;
    let currentIndex = e.currentTarget.dataset.index;
    if(currentIndex=="0"){
      // 选择地址
      let selected_address = pageObj.data.addresses[pageObj.data.selected_address_idx];
      pageObj.setData({
        selected_address: selected_address,
        showModalStatus: false,
      });
      wx.showToast({
        title: '已选择地址',
      })
    } else if (currentIndex == "1"){
      // 添加地址
      let address_form = this.data.address_form
      // 检查数据
      if (!util.isVaildAddressForm(address_form))return;
      new Promise((resolve, reject) => {
        pageObj.request({
          url: app.globalData.host + "address_edit",
          method: "POST",
          data: address_form,
          success: res => {
            wx.showToast({
              title: '已添加地址',
            });
            pageObj.clear_area();
            pageObj.setData({
              address_form: {}
            })
            resolve(res);
          }
        })
      }).then(res=>{
        pageObj.request({
          url: app.globalData.host + "address_list",
          success: res => {
            pageObj.setData({
              addresses: res.data.data.addresses,
              showModalStatus: false,
            })
            let selected_address = pageObj.data.addresses[0];
            if (selected_address.is_default) {
              pageObj.setData({
                selected_address: selected_address
              })
            } 
          }
        })
      })
    }
  },
  checkAddress: function(e){
    this.setData({
      selected_address_idx : e.detail.value
    });
  },
  copyPrice:function(e){
    let pageObj = this;
    let qrcode_price = pageObj.data.qrcode_price;
    if(!qrcode_price)return;
    wx.setClipboardData({
      data: qrcode_price + "",
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制价格成功'
            })
          }
        })
      }
    })
  },
  previewQrcode: function(e){
    let pageObj = this;    
    let qrcode_url = pageObj.data.assets_host + pageObj.data.qrcode;
    let page_type = e.currentTarget.dataset.type
    wx.previewImage({
      urls: [qrcode_url],
      current: qrcode_url,
      success:()=>{
        pageObj.togglePayModal({
          status:"close"
        });
        pageObj.request({
          url: app.globalData.host + "order_edit",
          method: "POST",
          data:{
            order_ids: pageObj.data.order_ids,
            status: 3
          },
          success: res => {
            let new_data = {}
            if(page_type == 'list'){
              let { orders } = pageObj.data;
              let { checked_order_idxs } = pageObj.data;
              checked_order_idxs.forEach(idx=>{
                orders.splice(idx, 1);
              });
              new_data = {
                "options.total_price": 0,
                "options.btn_text": null,
                orders: orders,
                order_ids: [],
                checked_order_idxs: []
              }
            }else if(page_type == 'detail'){
              new_data["status"] = 3;
            }
            pageObj.setData(new_data)
          }
        })
      }
    })
  }
}