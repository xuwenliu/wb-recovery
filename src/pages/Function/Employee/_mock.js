// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url';

// mock tableListDataSource
const genList = (current, pageSize) => {
  const tableListDataSource = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      name: `TradeCode ${index}`,
      owner: '曲丽丽',
      desc: '这是一段描述',
      callNo: Math.floor(Math.random() * 1000),
      status: (Math.floor(Math.random() * 10) % 4).toString(),
      updatedAt: new Date(),
      createdAt: new Date(),
      progress: Math.ceil(Math.random() * 100),
    });
  }

  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...tableListDataSource].slice((current - 1) * pageSize, current * pageSize);
  const sorter = JSON.parse(params.sorter);

  if (sorter) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((id) => {
        if (sorter[id] === 'descend') {
          if (prev[id] - next[id] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }

          return;
        }

        if (prev[id] - next[id] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }

  if (params.filter) {
    const filter = JSON.parse(params.filter);

    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).some((id) => {
          if (!filter[id]) {
            return true;
          }

          if (filter[id].includes(`${item[id]}`)) {
            return true;
          }

          return false;
        });
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
  }

  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };
  return res.json(result);
}

function postRule(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, id } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(
        (item) => id.toString().indexOf(item.id) === -1,
      );
      break;

    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule = {
          id: tableListDataSource.length,
          href: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          name,
          owner: '曲丽丽',
          desc,
          callNo: Math.floor(Math.random() * 1000),
          status: (Math.floor(Math.random() * 10) % 2).toString(),
          updatedAt: new Date(),
          createdAt: new Date(),
          progress: Math.ceil(Math.random() * 100),
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();

      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === id) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }

          return item;
        });
        return res.json(newRule);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };
  res.json(result);
}

function getInfo(req, res, u) {
  const result = {
    no: 123,
    location: '成都高新区',
    editorState:
      '<p><em><strong><span style="letter-spacing:4px">绿咖喱鸡阿李经理</span></strong></em></p><p></p><div class="media-wrap image-wrap"><img src="data:image/png;base64,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"/></div><p><span style="line-height:1.75"><span style="font-size:64px">拉法基第六届了</span></span></p><p><span style="color:#fdda00">23456</span></p>',
    id: 123,
    href: 'https://ant.design',
    name: 'name',
    owner: '曲丽丽',
    desc: 'desc',
    callNo: Math.floor(Math.random() * 1000),
    status: (Math.floor(Math.random() * 10) % 2).toString(),
    updatedAt: new Date(),
    createdAt: new Date(),
    progress: Math.ceil(Math.random() * 100),
  };
  return res.json(result);
}

export default {
  'GET /api/function/employee': getRule,
  'GET /api/function/employee/info': getInfo,
  'POST /api/function/employee': postRule,
};
