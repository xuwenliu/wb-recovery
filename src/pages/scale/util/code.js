const codes = {
  AEPS: 'S0001',
  GMFM: 'S0002',
  FMFM: 'S0003',
  PEDI: 'S0004',
  Gesell: 'S0005',
  PDMS: 'S0006',
  TAIPEI2: 'S0057',
  YGTSS: 'S0056',
  教师和家长评估量表: 'S0061',
  睡眠评估问卷: 'S0059',
  婴幼儿口腔评定量表: 'S0060',
  双溪量表: 'S0062',
};

const findNameByCode = ({ code }) => {
  let value = code;
  Object.keys(codes).forEach(i => {
    if (codes[i] === code) {
      value = i;
    }
  });

  return value;
};

const findCodeByName = ({ name }) => {
  return codes[name];
};

export { codes, findNameByCode, findCodeByName };
