const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};

// 프록시 서버는 아이피를 임의로 바꿔 버릴 수 있는 것이다. 그래서 인터넷에서는 접근하는
// 사람의 IP를 모르게하며 보내는 데이터 또한 임의로 바꿀 수 있다.
// 즉 방화벽 기능과 웹 필터 기능, 캐쉬데이터와 공유 데이터도 제공할 수 있는 기능이 있다.
// 회사에서 직원들이나 집안에서 아이들 인터넷 사용을 제어하는데 활용된다.

// 문서참조 : https://create-react-app.dev/docs/proxying-api-requests-in-development