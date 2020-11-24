import PEDI from './PEDI';
import AEPS from './AEPS';
import FMFM from './FMFM';
// import PDMS from './PDMS';

const define = {
  PEDI,
  AEPS,
  FMFM,
  // PDMS,
};

export function getCmponent(name) {
  return define[name];
}
