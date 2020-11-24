import S0006 from './PDMS';
import S0001 from './AEPS';
import S0004 from './PEDI';
import S0005 from './Gesell';
import S0002 from './GMFM';
import S0003 from './FMFM';
import S0057 from './TAIPEI2';

const define = {
  S0004,
  S0006,
  S0001,
  S0005,
  S0002,
  S0003,
  S0057,
};

export function getCmponent(code) {
  return define[code];
}
