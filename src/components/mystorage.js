// 多窗口 实现 失败 需要刷新
// (function() {
//   // 入口，用于触发核心事件
//   if (!sessionStorage.length) {
//     localStorage.setItem('getSession', Date.now())
//     console.log(1)
//   }
//   console.log(2)
//   // 该事件是核心
//   window.addEventListener('storage', function(event) {
//     console.log(3)
//     // 已有窗口
//     if (event.key === 'getSession') {
//       console.log(4)
//       localStorage.setItem('setSession', JSON.stringify(sessionStorage))
//       localStorage.removeItem('setSession')
//     } else if (event.key === 'setSession' && !sessionStorage.length) {
//       // 新开窗口
//       console.log(5)
//       const data = JSON.parse(event.newValue)
//       // 赋给这个窗口的sessionStorage
//       for (const key in data) {
//         sessionStorage.setItem(key, data[key])
//       }
//     }
//   })
// })()
