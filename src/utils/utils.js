import { parse } from 'querystring';
import { getCommonAllEnums } from '@/services/common';
import { fileUpload } from '@/services/common';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const queryCommonAllEnums = async () => {
  const res = await getCommonAllEnums();
  if (!res) return;
  const erArr = Object.entries(res);
  const newArr = [];
  erArr.forEach((item) => {
    // const key = item[0].replace(/[^a-zA-Z]/g, ''); // 取出英文当key
    const key = item[0]; // 取出英文当key
    const value = Object.values(item[1]);
    newArr.push({
      key,
      value,
    });
  });
  return newArr;
};
// 从所有枚举里面获取type类型的枚举
export const getSingleEnums = (key, all) => {
  console.log(key, all);
  return all
    .filter((item) => item.key === key)
    .map((item) => item.value)[0]
    .sort((a, b) => a.ordianl - b.ordianl);
};

export const media = () => {
  const uploadFn = async (param) => {
    const formData = new FormData();
    formData.append('file', param.file);
    const res = await fileUpload(formData);
    if (res) {
      param.success({
        url: res,
        meta: {
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
        },
      });
    } else {
      param.error({
        msg: '上传失败',
      });
    }
  };

  return {
    uploadFn,
  };
};
