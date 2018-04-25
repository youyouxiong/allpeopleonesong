import config from '../../config/config'
import utils from '../../utils/index'

const app = getApp()
Page({
  data: {
    name: '',
    phone: '',
    company: '',
    isFirstCommit: true
  },
  onLoad: function () {
    utils.getUserProfile(this, (res) => {
      let {
        name,
        phone,
        company
      } = res.data.objects[0]

      if (res.data.meta.total_count != 0) {
        this.setData({
          name,
          phone,
          company,
          isFirstCommit: false,
          recordID: res.data.objects[0].id
        })

      } else {
        this.setData({
          name: (wx.BaaS.storage.get('userinfo')).nickname,
        })
      }
    })
  },

  

})
