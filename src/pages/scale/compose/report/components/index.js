import S0004 from './PEDI';
import S0006 from './PDMS';
import S0001 from './AEPS';
import S0003 from './FMFM';
import S0002 from './GMFM';
import S0005 from './Gesell';
import S0056 from './YGTSS';
import S0057 from './TAIPEI2';
import S0061 from './SNAP-Ⅳ';
import S0062 from './S0062';

import DEFAULT from './Default';

const define = {
  S0004,
  S0006,
  S0001,
  S0003,
  S0002,
  S0005,
  S0056,
  S0057,
  S0061,
  S0062,
};

export function getCmponent(code) {
  return define[code] || DEFAULT;
}
