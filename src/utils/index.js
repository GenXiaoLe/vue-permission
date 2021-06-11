import Cookies from "js-cookie";

export function resetUrl (path) {
  if (path.indexOf('=') > -1) {
    const urlObj = path.split('=');
    path = '';
    urlObj.map((item, index) => {
      if (item.indexOf('&') > -1) {
        const reset = (urlObj.length - Number(index)) == 1 ? '' : '&' + item.split('&')[1] + '=*';
        path += reset;
      } else if (index == 0) {
        path += item + '=*';
      }
    });
  }
  return path;
}

/**
 * url 处理
 * @param {*} uri
 */
 export function formatUrl (uri) {
  let path = ''
  const params = {}
  let urls = ''
  if (uri) {
    try {
      urls = new URL(uri)
    } catch (error) {
      urls = {}
    }
    path = urls.pathname || '';
    const querys = (urls.search || '').substring(1).split('&')
    if (querys.length > 0) {
      // 分割参数
      querys.forEach((item) => {
        if (item === '') {
          return
        }
        const pair = item.split('=')
        if (pair.length > 0) {
          if (pair[0] === '') {
            return
          }
          params[pair[0]] = pair[1]
        }
      })
    }
  }
  return {
    path,
    query: params
  }
}

/**
 * 拼接转换url
 * @param {*} url 权限列表
 * @param {*} query url
 */
 export function changeUrlStr (url, query) {
  let permUrl = url || ''
  const params = Object.keys(query) || []
  if (params.length > 0) {
    permUrl = permUrl + '?'
    params.forEach((item, idx) => {
      permUrl = permUrl + item + '=*'
      if (idx < params.length - 1) {
        permUrl = permUrl + '&'
      }
    })
  }
  return permUrl
 }

 // 获取登录 Cookie token
export function getCookie(key) {
  return Cookies.get(key);
}

// 存入 Cookie token
export function setCookie(key, val) {
  Cookies.set(key, val);
}