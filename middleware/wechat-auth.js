export default function ({ store, route, redirect }) {
  // route为当前的路由
  if (!store.state.authUser) {
    let { fullPath } = route

    console.log(fullPath)
    // let newFullPath = encodeURIComponent(fullPath.substr(1))
   
    return redirect(`/wx-redirect?visit=#{fullPath}`)
  }
}
