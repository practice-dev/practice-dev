# practice.dev

This is a monorepo for all public packages and challenges.

## Structure

- `content` - contains all challenges
- `packages` - contains all shared packages
- `packages/schema` - a custom library for validation
- `packages/tester` - a tester library based on [Puppeteer](https://github.com/puppeteer/puppeteer)
- `packages/tools` - contains various tools for deployment, building etc
- `packages/types` - contains shared types
- `packages/ui` - contains shared React components used for building challenge details

## Requirements

- node v14
- ts-node (`npm i -g ts-node`)
- yarn (run `yarn` in root directory)

## Running tests locally

```
  cd modules
  ts-node -T test 2 1 http://localhost:3000
```

Where `2` is the module id.  
Where `1` is the challenge id.  
Where `http://localhost:3000` is the url to test.

## LICENSE

All packages under `packages/*` are licensed under the [MIT license](https://opensource.org/licenses/MIT).

Package `content` is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
If you distribute it in any form, you must add the following attribution at the beginning of the challenge details.

```
This challenge comes from https://practice.dev.
```
