# branch-commit-msg

[![Build](https://github.com/brajkowski/branch-commit-msg/actions/workflows/build.yml/badge.svg)](https://github.com/brajkowski/branch-commit-msg/actions/workflows/build.yml)
[![npm:beta](https://img.shields.io/npm/v/branch-commit-msg/beta?logo=npm)](https://www.npmjs.com/package/branch-commit-msg)
[![codecov](https://codecov.io/gh/brajkowski/branch-commit-msg/branch/beta/graph/badge.svg?token=NWWKAPQ3C7)](https://codecov.io/gh/brajkowski/branch-commit-msg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Overview

`branch-commit-msg` is a [git commit-msg hook](https://git-scm.com/docs/githooks#_commit_msg) that extracts a configurable regex pattern from the current branch and reformats the final commit message to the configured format.

## Installation

With no dependency:

```sh
$ npx branch-commit-msg install
```

With [husky](https://github.com/typicode/husky):

```sh
$ npm install -D branch-commit-msg
$ npx husky add .husky/commit-msg 'npx branch-commit-msg-hook "$1"'
```

## Examples

### Preface commit message with a [Shortcut](https://shortcut.com/) ticket number

```json
// .commitmsgrc.json (at repository root)
{
  "extractPattern": "sc-[0-9]+",
  "extractPatternMatchCase": false,
  "commitMsgFormat": "%b0 - %m"
}
```

```sh
# Current branch: SC-123456/my-new-feature
$ git commit -m "added a thing"
$ git log -1 --pretty=%B
# Output: SC-123456 - added a thing
```

### Suffix and format a commit message with a [JIRA](https://www.atlassian.com/software/jira) ticket

```json
// .commitmsgrc.json (at repository root)
{
  "extractPattern": "SOMEPRJ-[0-9]+",
  "extractPatternMatchCase": false,
  "commitMsgFormat": "%m (%b0 | upper)"
}
```

```sh
# Current branch: feature/someprj-123456
$ git commit -m "added a thing"
$ git log -1 --pretty=%B
# Output: added a thing (SOMEPRJ-123456)
```

### Go crazy with group matching

```json
// .commitmsgrc.json (at repository root)
{
  "extractPattern": "(some).*(complex[0-9-]+).*(branch)",
  "extractPatternMatchCase": false,
  "commitMsgFormat": "%m | upper to %b1 | upper %b2 %b3 | lower"
}
```

```sh
# Current branch: some/CoMpLEX-123-5/BRANCH
$ git commit -m "added a thing"
$ git log -1 --pretty=%B
# Output: ADDED A THING to SOME CoMpLEX-123-5 branch
```

## Development

### Prerequisites

- [Docker](https://www.docker.com/) installation (for integration and end-to-end (e2e) testing)
- [Node.js](https://nodejs.org/en/) runtime
- [Yarn](https://yarnpkg.com/) installation

### Install Dependencies

```
$ yarn install
```

### Test

```
$ yarn test[:unit|:integration|:e2e]
```

### Build

```
$ yarn build
```
