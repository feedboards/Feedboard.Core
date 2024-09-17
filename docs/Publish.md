# publish package to `npmjs`

create `.yarnrc.yml` or `.npmrc`

`.yarnrc.yml` file

```yaml
npmAuthToken: '<NPM_TOKEN>'
npmRegistryServer: 'https://registry.npmjs.org'
```

`.npmrc` file

```
//registry.npmjs.org/:_authToken=<NPM_TOKEN>
registry=https://registry.npmjs.org
```
