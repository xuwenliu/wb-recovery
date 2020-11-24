export function getError({ errors = [] }) {
  /**
   * 轉換 rc-form 錯誤到 material-ui
   */

  let result;

  if (errors.length > 0) {
    result = {
      error: true,
      helperText: errors.join(','),
    };
  } else {
    result = {};
  }

  console.log('getError', result);

  return result;
}
