function run() {
    import('./utils.js')
        .then(module => {
            console.log('utils.js 加载完成--')
            console.log(module.add(1, 2))
        })
        .catch(error => {
            console.log('utils.js 加载失败')
            console.log(error)
        })
}

run()
