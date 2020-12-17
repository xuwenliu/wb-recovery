/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

const server = 'http://cr.ts-health.cn'; // 'http://127.0.0.1:5001';

// 'http://127.0.0.1:5001'

export default {
  // http://cr.ts-health.cn
  // http://127.0.0.1:5001
  dev: {
    '/api/login/execute': {
      target: server,
      changeOrigin: true,
    },
    '/api/scale/': {
      target: server,
      changeOrigin: true,
    },
    '/api/project': {
      target: server,
      changeOrigin: true,
    },
    '/api/object': {
      target: server,
      changeOrigin: true,
    },
    '/api/demographics': {
      target: server,
      changeOrigin: true,
    },
    '/api/': {
      target: 'http://49.4.25.130:8080',
      changeOrigin: true,
    },
    '/common/': {
      target: 'http://49.4.25.130:8080',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
