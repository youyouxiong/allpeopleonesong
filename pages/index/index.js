//index.js
import config from '../../config/config'
import utils from '../../utils/index'
const app = getApp()

Page({
  data: {
    imgLogo: config.ROUTE.IMG.LOGO,
    imgLogout: config.ROUTE.IMG.UNLOGIN,
    imgDot: config.ROUTE.IMG.DOT,
    imgDotActive: config.ROUTE.IMG.DOT_ACTIVE,
    pageCount: 3,
    pageIndex: 0,
    isLogin: false,
    isProfileComplete: false,
    userInfo: null,
    avatarUrl: '',
  },

  onLoad(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onShow() {
    this.initPage()
  },

  initPage(){
    /**
     * 由于 wx.BaaS.login 是异步接口，uid 需要通过在其成功的回调中的本地存储获取
     */
    const uid = wx.BaaS.storage.get('uid')
  
    if (!uid) {
      wx.BaaS.login()
      .then(res => {
        this.getUserInfo()
      })
      .catch(e => {})
    } else {
      this.getUserInfo()
    }
  },

  getUserInfo(e){
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    let _this = this
    utils.getUserProfile(this, res => {
      let userInfo = {}
      let _userInfo = res.data.objects[0]
      if (wx.BaaS.storage.get('is_logined_baas')) {
        userInfo.isLogin = true 
      } else {
        userInfo.isLogin = false
      }
      userInfo = Object.assign(userInfo, _userInfo)
      this.setData({
        userInfo,
        avatarUrl: wx.BaaS.storage.get('userinfo').avatarUrl
      })
    })
  },

  buyAction(e) {
    wx.navigateTo({
      url: config.ROUTE.PAGE.MUSIC
    })
  },
  buyAction1(e) {
    wx.navigateTo({
      url: config.ROUTE.PAGE.SHARE
    })
  },
  buyAction2(e) {
    wx.navigateTo({
      url: config.ROUTE.PAGE.HELP
    })
  },

  goToProfile(e) {
    wx.navigateTo({
      url: config.ROUTE.PAGE.PROFILE
    })
  },

  swiper(e) {
    let activePageIndex = e.detail.current
      this.setData({
        pageIndex: activePageIndex
      })
  }
})