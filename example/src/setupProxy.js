const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const publicUrl = ''
    let pathRewrite = {}
    let onProxyReq = null
    app.use(
        [
            `${publicUrl}/smevdispatcher/Gql/Query`,
        ],
        createProxyMiddleware({
            target: `http://192.168.0.157/SmevDispatcher.12_1`,
            changeOrigin: true,
            pathRewrite: pathRewrite,
            onProxyReq: onProxyReq
        })
    )
}
