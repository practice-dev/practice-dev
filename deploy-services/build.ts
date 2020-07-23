import Path from 'path';

import { buildApi } from '@pvd/tools';

buildApi({
  basedir: Path.join(__dirname, '../services/flaky-api'),
});
