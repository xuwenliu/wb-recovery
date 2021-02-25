import S0004 from './PEDI';
import S0001 from './AEPS';
import S0003 from './FMFM';
// import PDMS from './PDMS';

const define = {
  S0001,
  S0003,
  S0004,
  // PDMS,
};

export function getCmponent(code) {
  return define[code];
}
