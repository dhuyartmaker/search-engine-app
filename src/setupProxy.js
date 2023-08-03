const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    target: process.env.REACT_APP_API,
    changeOrigin: true,
    pathRewrite: (path) => path.replace('/api', '/')
}
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware(proxy),
    );
};