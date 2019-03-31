const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isVaildAddressForm = function(address_form){
  if (!address_form.name || !address_form.phone || !address_form.province || !address_form.city || !address_form.area || !address_form.detail) {
    wx.showToast({
      title: '条目均不能为空',
      icon: '',
      image: '/assets/error.png',
      duration: 2000,
    });
    return false
  };
  if (!(/^1[34578]\d{9}$/.test(address_form.phone))) {
    wx.showToast({
      title: '手机号码不合法',
      icon: '',
      image: '/assets/error.png',
      duration: 2000,
    });
    return false
  }
  return true;
}

const request = function(req){
  let cookie = this.data.sessionid;
  if(!cookie){
    // 无法获取cookie，跳转到授权页面
    wx.redirectTo({
      url: "/pages/auth/auth"
    });
  }
  req["header"] = {
    'cookie': cookie
  }
  // 1.5秒后播放加载动画
  let _id = setTimeout(()=>{
    this.setData({
      isLoading: true
    })
  }, 1500);
  req['fail'] = res => {
    wx.showToast({
      title: '网络异常',
      icon: '',
      image: '/assets/error.png',
      duration: 2000,
      mask: true,
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    });
  }

  let success_func = req['success'];
  req['success'] = res => {
    if(res.statusCode != 200){
      wx.showToast({
        title: '网络请求失败',
        icon: '',
        image: '/assets/error.png',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });      
    }else{
      let _status = res.data["status"];
      if (!_status) {
        success_func && success_func(res)
      } else {
        if (_status == 1) {
          // 显示错误信息页面
          wx.showModal({
            title: '出错了',
            content: res.data['msg'],
          });
        } else if (_status == 2) {
          // 跳转到授权页面
          wx.redirectTo({
            url: "/pages/auth/auth"
          });
        }
      }
    }
  }

  let complete_func = req['complete'];
  req['complete'] = res => {
    // 关闭加载动画
    clearTimeout(_id);
    this.setData({
      isLoading: false
    })
    complete_func && complete_func(res);
  }
  // 自定义网络接口
  wx.request(req);
}

const cartCount = function(){
  let cart_keys = wx.getStorageSync("cart_keys");
  if(cart_keys){
    cart_keys = JSON.parse(cart_keys);
    return cart_keys.length
  }
  return 0
}

const cartAdd = function(key, count){
  key = Number(key);
  count = Number(count);
  let cart_keys = wx.getStorageSync("cart_keys");
  if (cart_keys) {
    cart_keys = JSON.parse(cart_keys);
  }else{
    cart_keys = [];
  }
  if (cart_keys.indexOf(key) == -1){
    cart_keys.push(key);
  }
  wx.setStorageSync("cart_" + key, count);
  wx.setStorageSync("cart_keys", JSON.stringify(cart_keys));
}

const cartRemove = function(key, count){
  key = Number(key);
  count = Number(count);
  let cart_keys = wx.getStorageSync("cart_keys");
  if (cart_keys) {
    cart_keys = JSON.parse(cart_keys);
  } else {
    cart_keys = [];
  }
  let idx = cart_keys.indexOf(key)
  if(idx > -1){
    cart_keys.splice(idx, 1);
  }
  wx.removeStorageSync("cart_" + key);
  wx.setStorageSync("cart_keys", JSON.stringify(cart_keys));
}

module.exports = {
  formatTime: formatTime,
  request: request,
  cartCount: cartCount,
  cartAdd: cartAdd,
  cartRemove: cartRemove,
  isVaildAddressForm: isVaildAddressForm
}
