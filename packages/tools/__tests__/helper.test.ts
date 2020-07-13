import tmp from 'tmp';
import Path from 'path';
import fs from 'fs';
import {
  getEntryForChallenges,
  getChallengePackages,
  getProjectPackages,
} from '../src/helper';

let dir: tmp.DirResult = null!;

beforeEach(() => {
  dir = tmp.dirSync({
    unsafeCleanup: true,
  });
});
afterEach(() => {
  dir.removeCallback();
});

function getAbsolute(path: string) {
  return Path.join(dir.name, path);
}

describe('getBuildDetailsEntryForChallenges', () => {
  it('should return files correctly', () => {
    fs.mkdirSync(getAbsolute('001-foo'));
    fs.mkdirSync(getAbsolute('001-foo/details'));
    fs.writeFileSync(getAbsolute('001-foo/details/index.tsx'), '');
    fs.mkdirSync(getAbsolute('002-bar'));
    fs.mkdirSync(getAbsolute('002-bar/details'));
    fs.writeFileSync(getAbsolute('002-bar/details/index.tsx'), '');

    const result = getEntryForChallenges(dir.name, 'details');
    expect(result).toEqual({
      '001-foo': ['./001-foo/details/index.tsx'],
      '002-bar': ['./002-bar/details/index.tsx'],
    });
  });
  it('should throw error if details does not exist', () => {
    const getAbsolute = (path: string) => Path.join(dir.name, path);
    fs.mkdirSync(getAbsolute('001-foo'));
    fs.mkdirSync(getAbsolute('001-foo/details'));
    expect(() => getEntryForChallenges(dir.name, 'details')).toThrow(
      `"./001-foo/details/index.tsx" doesn't exist`
    );
  });
});

describe('getChallengePackages', () => {
  it('should return packages correctly', async () => {
    fs.mkdirSync(getAbsolute('dist'));
    fs.mkdirSync(getAbsolute('dist/details'));
    fs.mkdirSync(getAbsolute('dist/tests'));

    fs.mkdirSync(getAbsolute('001-foo'));
    fs.writeFileSync(
      getAbsolute('001-foo/info.ts'),
      `
    export const info = {
      id: 1,
      title: 'foo',
      description: 'foo desc',
      tags: [],
      difficulty: 'easy',
      domain: 'frontend',
    };`
    );
    fs.writeFileSync(
      getAbsolute('dist/tests/001-foo.js'),
      `
    module.exports.default = {
      page: 'single',
      handler({ tester, url}) {
        tester.test('test 1', () => {})
        tester.test('test 2', () => {})
      }
    };`
    );
    fs.writeFileSync(getAbsolute('dist/details/001-foo.js'), `//content`);

    fs.mkdirSync(getAbsolute('002-bar'));
    fs.writeFileSync(
      getAbsolute('002-bar/info.ts'),
      `
    export const info = {
      id: 2,
      title: 'bar',
      description: 'bar desc',
      tags: [],
      difficulty: 'easy',
      domain: 'backend',
    };`
    );
    fs.writeFileSync(
      getAbsolute('dist/tests/002-bar.js'),
      `
    module.exports.default = {
      handler({ tester, url}) {
        tester.test('test 1', () => {})
        tester.test('test 2', () => {})
      }
    };`
    );
    fs.writeFileSync(getAbsolute('dist/details/002-bar.js'), `//content`);

    const result = await getChallengePackages(dir.name);
    result.forEach(item => {
      [item.detailsFile, item.testFile].forEach(file => {
        file.content = null!;
        file.path = file.path.replace(dir.name, '/path');
      });
    });
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "foo desc",
          "detailsFile": Object {
            "content": null,
            "name": "001-foo.526ea0c2c0f70c5336ff04283299eefe.js",
            "path": "/path/dist/details/001-foo.js",
          },
          "difficulty": "easy",
          "dirName": "001-foo",
          "domain": "frontend",
          "id": 1,
          "tags": Array [],
          "testFile": Object {
            "content": null,
            "name": "001-foo.a28f473984c1391d438e2bded5c1afd5.js",
            "path": "/path/dist/tests/001-foo.js",
          },
          "testInfo": Array [
            Object {
              "id": 1,
              "name": "test 1",
              "result": "pending",
              "steps": Array [],
            },
            Object {
              "id": 2,
              "name": "test 2",
              "result": "pending",
              "steps": Array [],
            },
          ],
          "title": "foo",
        },
        Object {
          "description": "bar desc",
          "detailsFile": Object {
            "content": null,
            "name": "002-bar.526ea0c2c0f70c5336ff04283299eefe.js",
            "path": "/path/dist/details/002-bar.js",
          },
          "difficulty": "easy",
          "dirName": "002-bar",
          "domain": "backend",
          "id": 2,
          "tags": Array [],
          "testFile": Object {
            "content": null,
            "name": "002-bar.d5ea7872f247312a5dffcccc4f803563.js",
            "path": "/path/dist/tests/002-bar.js",
          },
          "testInfo": Array [
            Object {
              "id": 1,
              "name": "test 1",
              "result": "pending",
              "steps": Array [],
            },
            Object {
              "id": 2,
              "name": "test 2",
              "result": "pending",
              "steps": Array [],
            },
          ],
          "title": "bar",
        },
      ]
    `);
  });
});

describe('getProjectPackages', () => {
  it('should return packages correctly', async () => {
    fs.mkdirSync(getAbsolute('dist'));
    fs.mkdirSync(getAbsolute('dist/details'));
    fs.mkdirSync(getAbsolute('dist/details/001-foo'));
    fs.mkdirSync(getAbsolute('dist/tests'));
    fs.mkdirSync(getAbsolute('dist/tests/001-foo'));

    fs.mkdirSync(getAbsolute('001-foo'));
    fs.writeFileSync(
      getAbsolute('001-foo/info.ts'),
      `
    export const info = {
      id: 1,
      title: 'foo',
      description: 'foo desc',
      domain: 'fullstack',
      challenges: [
        {
          id: 1,
          title: 'C1',
          description: 'C1 - desc',
          domain: 'frontend',
        },
        {
          id: 2,
          title: 'C2',
          description: 'C2 - desc',
          domain: 'frontend',
        }
      ],
    };`
    );
    // fs.mkdirSync(getAbsolute('001-foo/challenge-1'));
    // fs.mkdirSync(getAbsolute('001-foo/challenge-1/details'));
    fs.writeFileSync(
      getAbsolute('dist/tests/001-foo/1.js'),
      `
    module.exports.default = {
      page: 'single',
      handler({ tester, url}) {
        tester.test('test 1', () => {})
        tester.test('test 2', () => {})
      }
    };`
    );
    fs.writeFileSync(getAbsolute('dist/details/001-foo/1.js'), `//content`);

    fs.writeFileSync(
      getAbsolute('dist/tests/001-foo/2.js'),
      `
    module.exports.default = {
      handler({ tester, url}) {
        tester.test('test 1', () => {})
        tester.test('test 2', () => {})
      }
    };`
    );
    fs.writeFileSync(getAbsolute('dist/details/001-foo/2.js'), `//content`);

    const result = await getProjectPackages(dir.name);
    result.forEach(project => {
      project.challenges.forEach(item => {
        [item.detailsFile, item.testFile].forEach(file => {
          file.content = null!;
          file.path = file.path.replace(dir.name, '/path');
        });
      });
    });
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "challenges": Array [
            Object {
              "description": "C1 - desc",
              "detailsFile": Object {
                "content": null,
                "name": "001-foo-1.526ea0c2c0f70c5336ff04283299eefe.js",
                "path": "/path/dist/details/001-foo/1.js",
              },
              "domain": "frontend",
              "id": 1,
              "testFile": Object {
                "content": null,
                "name": "001-foo-1.a28f473984c1391d438e2bded5c1afd5.js",
                "path": "/path/dist/tests/001-foo/1.js",
              },
              "testInfo": Array [
                Object {
                  "id": 1,
                  "name": "test 1",
                  "result": "pending",
                  "steps": Array [],
                },
                Object {
                  "id": 2,
                  "name": "test 2",
                  "result": "pending",
                  "steps": Array [],
                },
              ],
              "title": "C1",
            },
            Object {
              "description": "C2 - desc",
              "detailsFile": Object {
                "content": null,
                "name": "001-foo-2.526ea0c2c0f70c5336ff04283299eefe.js",
                "path": "/path/dist/details/001-foo/2.js",
              },
              "domain": "frontend",
              "id": 2,
              "testFile": Object {
                "content": null,
                "name": "001-foo-2.d5ea7872f247312a5dffcccc4f803563.js",
                "path": "/path/dist/tests/001-foo/2.js",
              },
              "testInfo": Array [
                Object {
                  "id": 1,
                  "name": "test 1",
                  "result": "pending",
                  "steps": Array [],
                },
                Object {
                  "id": 2,
                  "name": "test 2",
                  "result": "pending",
                  "steps": Array [],
                },
              ],
              "title": "C2",
            },
          ],
          "info": Object {
            "challenges": Array [
              Object {
                "description": "C1 - desc",
                "domain": "frontend",
                "id": 1,
                "title": "C1",
              },
              Object {
                "description": "C2 - desc",
                "domain": "frontend",
                "id": 2,
                "title": "C2",
              },
            ],
            "description": "foo desc",
            "domain": "fullstack",
            "id": 1,
            "title": "foo",
          },
          "name": "001-foo",
        },
      ]
    `);
  });
});
