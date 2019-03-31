module.exports={
  changeAddressFrom: function(e){
    let data = {}
    data["address_form." + e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data)
  }
}