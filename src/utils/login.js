import { checkToken, getClientId, getGroupParam, haierAccountInfo, logout } from '@/api/login';
import config from '@/config/config'
import { getStore, removeStore, setStore } from '@/utils/storage';
import router from '../router'
import Vue from 'vue'
// import { configUserCenter, login } from '@haier/fe-stub-usercenter';

// 对接集团统一登录
export const removeLoginInfo = (clientCode) => {
  // removeStore(`${clientCode}Token`)
  removeStore('clientPmpToken')
  removeStore('haier-user-center-user-info')
  removeStore('haier-user-center-access-token')
  removeStore(`${clientCode}NickName`)
  removeStore(`helpUserName`)
}

function userCenter() {
  let clientCode = config.clientCode
  return new Promise((resolve, reject) => {
    getClientId(clientCode).then((data) => {
      if (data.code === 200) {
        // debugger
        let clientId = data.data.clientId;
        setStore(`${clientCode}ClientId`, clientId)
        getGroupParam(clientId, 'haier_auth').then((data) => {
          console.log(data);
          let clientId1 = data.data.clientId;
          data.data.clientId1 = clientId
          resolve(data)
        }, () => {
          reject()
        });
      }
    });
  })
}

export const getToke = (resolve) => {
  // let clientCode = 'FA000702';
  // debugger
  userCenter().then((data) => {
    let clientId = data.data.clientId1;
    let clientId1 = data.data.clientId;
    if (data.code === 200) {
      debugger
      window.__USERCENTER__.configUserCenter({
        clientId: clientId1, //账号中心cliendtId
        ssoUrl: data.data.ssoUrl, //账号中心统一登录页
        appId: data.data.appId, //开放平台创建应用获取（open.feishu.cn）
        tokenUrl: `${data.data.tokenUrl}` //集成了账号中心提供的后端服务的地址
      });
      window.__USERCENTER__.login()
        .then((data) => {
          // debugger
          console.log('data', data)
          setStore(`${config.clientCode}JituanToken`, data.token)
          setStore(`${config.clientCode}NickName`, data.userInfo.nickName)
          setStore(`${config.clientCode}UserName`, data.userInfo.userName)
          Vue.prototype.$apm.setUserContext({
            id: data.userInfo.userName,
            username: data.userInfo.nickName,
            email: ''
          })
          haierAccountInfo(clientId, 'haier_auth').then((data) => {
            // debugger
            if (data.code === 200 && data.data) {
              setStore('clientPmpToken', data.data.access_token)
              console.log('clientPmpToken11111111111111111111111111111')
              console.log(data);
              // this.getList();
              resolve()
            } else {
              setStore('errMessage', data.msg)
              router.push({
                path: '/401'
              })
            }
          }).catch((res) => {
            console.log(res.message)
            setStore('errMessage', res.message)
            router.push({
              path: '/401'
            })
          });
        })
        .catch(() => {
        });
    }
  })
}

export const checkIsLogin= (str) => {
  let clientCode = config.clientCode
  return new Promise((resolve, reject) => {
    if (!getStore('clientPmpToken')) {
      removeLoginInfo(clientCode)
      getToke(resolve, clientCode)
    } else {
      // debugger
      checkToken().then((data) => {
        if (data.code === 200) {
          setStore(`helpUserName`, data.data.user_name)
          // this.getList();
          resolve()
        } else {
          removeLoginInfo(clientCode)
          getToke(resolve, clientCode)
        }
      }).catch(() => {
        if (!str) {
          removeLoginInfo(clientCode)
          getToke(resolve, clientCode)
        } else {
          removeLoginInfo(clientCode)
          reject()
        }
      });
    }
  })
}

export const outLogin401 = () => {
  // let clientCode = 'FA000702';
  // debugger
  let clientCode = config.clientCode
  userCenter().then((data) => {
    let clientId1 = data.data.clientId;
    let clientId = data.data.clientId1;
    // debugger
    removeLoginInfo(clientCode)
    if (data.code === 200) {
      window.__USERCENTER__.configUserCenter({
        clientId: clientId1, //账号中心cliendtId
        ssoUrl: data.data.ssoUrl, //账号中心统一登录页
        appId: data.data.appId, //开放平台创建应用获取（open.feishu.cn）
        tokenUrl: `${data.data.tokenUrl}` //集成了账号中心提供的后端服务的地址
      });
      window.__USERCENTER__.logout().then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err,'err');
      })
    }
  })
}

export const outLogin = () => {
  let clientCode = config.clientCode
  // debugger
  userCenter().then((data) => {
    let clientId1 = data.data.clientId;
    let clientId = data.data.clientId1;
    // debugger
    logout().then(() => {
      removeLoginInfo(clientCode)
      if (data.code === 200) {
        window.__USERCENTER__.configUserCenter({
          clientId: clientId1, //账号中心cliendtId
          ssoUrl: data.data.ssoUrl, //账号中心统一登录页
          appId: data.data.appId, //开放平台创建应用获取（open.feishu.cn）
          tokenUrl: `${data.data.tokenUrl}` //集成了账号中心提供的后端服务的地址
        });
        window.__USERCENTER__.logout().then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err,'err');
        })
      }
    })
  })
}

export const reLogin = () => {
  let clientCode = config.clientCode
  // debugger
  userCenter().then((data) => {
    let clientId1 = data.data.clientId;
    let clientId = data.data.clientId1;
    // debugger
    logout().then(() => {
      removeLoginInfo(clientCode)
      if (data.code === 200) {
        window.__USERCENTER__.configUserCenter({
          clientId: clientId1, //账号中心cliendtId
          ssoUrl: data.data.ssoUrl, //账号中心统一登录页
          appId: data.data.appId, //开放平台创建应用获取（open.feishu.cn）
          tokenUrl: `${data.data.tokenUrl}` //集成了账号中心提供的后端服务的地址
        });
        window.__USERCENTER__.reLogin().then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err,'err');
        })
      }
    })
  })
}
