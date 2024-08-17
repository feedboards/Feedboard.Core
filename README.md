# `build` and `watch`

```bash
# build
yarn build
# or
npm run build

# watch
yarn watch
# or
npm run watch
```

# Test in console

Create in root folder `test.mjs` file
then import

```js
import { ... } from './dist/index.js'

// do something
```

run

```bash
node ./test.mjs
```

# publish package

create `.yarnrc.yml` or `.npmrc`

`.yarnrc.yml` file
```yaml
npmAuthToken: "<NPM_TOKEN>"
npmRegistryServer: "https://registry.npmjs.org"
```

`.npmrc` file
```
//registry.npmjs.org/:_authToken=<NPM_TOKEN>
registry=https://registry.npmjs.org
```
