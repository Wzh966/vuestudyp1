// 封装方法，给localStorage设置有效期
// const myLocalStorage = class {
//   constructor() {
//     this.name = 'Storage'
//   }
// 设置存储
// key:需要存储的数据
// value:需要存储的数据
// expres：过期时间，毫秒单位
export const myLocalSetItem = (key, value, expires) => {
  const obj = {
    value: value,
    expires: expires * 1000, // 有效时间
    startTime: new Date().getTime()// 记录存储数据的时间，转换为毫秒值存下来
  }
  // 判断是否设置了有效时间
  if (obj.expires) {
    // 如果设置了时间，把obj转换数据类型转换为字符串对象存起来
    localStorage.setItem(key, JSON.stringify(obj))
  } else {
    // 如果没有设置有效时间，直接把value值存进去
    localStorage.setItem(key, JSON.stringify(obj.value))
  }
}

// 获取存储数据
export const myLocalGetItem = (key) => {
  // 先定义一个变量临时存放提取的值
  const temp = JSON.parse(localStorage.getItem(key))
  // 判断有没有设置expires属性
  // 如果有，就需要判断是否到期了
  if (temp !== null && temp.expires) {
    const data = new Date().getTime()
    if (data - temp.startTime > temp.expires) {
      // 此时说明数据已过期,清除掉
      localStorage.removeItem(key)
      // 直接return
      return
    } else {
      // 如果没有过期就输出
      return temp.value
    }
  } else {
    // 如果没有设置，直接输出
    return temp
  }
}

// 移出缓存
export const myLocalRemoveItem = (name) => {
  localStorage.removeItem(name)
}
// 移出全部缓存
export const myLocalClear = () => {
  localStorage.clear()
}
// }

// export default myLocalStorage
