
**Easily find and accumulate files by name, size, date and type.**

<!-- TODO : add more details to examples, setup, possible issues, contributing, "why" section -->



<br />

- [Installation](#installation)
- [Usage](#usage)
  - [Simple Example](#simple-example)
  - [Advanced Example](#advanced-example)
- [Config Options](#config-options)
  - [paths](#paths)
  - [ignorePaths](#ignorepaths)
  - [ignoreTypes](#ignoretypes)
  - [onlyTypes](#onlytypes)
  - [maxDepth](#maxdepth)
  - [modifiedAfter](#modifiedafter)
  - [modifiedBefore](#modifiedbefore)
  - [createdAfter](#createdafter)
  - [createdBefore](#createdbefore)
  - [sortBy](#sortby)
  - [sortOrder](#sortorder)
- [Date Formats](#date-formats)
  - [Standard Date Formats](#standard-date-formats)
  - [Relative Date Formats](#relative-date-formats)
- [File Extensions](#file-extensions)
- [Types](#types)
  - [Finder](#finder)
  - [FinderConfig](#finderconfig)
  - [FinderReturn](#finderreturn)
  - [FinderFileStat](#finderfilestat)
  - [SortMethod](#sortmethod)
  - [SortOrder](#sortorder-1)
- [License](#license)










<br />

# Installation


Install with your preferred package manager
```
yarn add @pratiq/finder
```

Finder is provided as the default export
```ts
import finder from '@pratiq/finder'
const finder = require('@pratiq/finder')
```














<br />
<br />
<br />

# Usage


```ts
import finder from '@pratiq/finder'

const data = finder({
    paths: ['../my/content'],
    ignoreTypes: ['d.ts'],
    modifiedAfter: '-10m'
})
```





<br />

## Simple Example
Get all files within the current directory, or at a specific path.  


```ts
import finder from '@pratiq/finder'

const myFiles = finder('../my/content')

console.log( myFiles.files[0] )
```






<br />

## Advanced Example

Provide advanced config for ignored paths/types and sorting

```ts
const fileData = finder({
    paths: ['../myFiles', './src'],         // search recursively in these two directories
    ignoreTypes: ['md', 'd.ts', 'test.js'], // ignore files with these three types
    modifiedAfter: '-15m',                  // only files modified within the last 15 minutes
    maxDepth: 10,                           // do not search deeper than 10 nested directories
    sortBy: 'size',                         // sort results by size (fileData.files)
    sortOrder: 'asc'                        // sort order of results (fileData.files)
})
```








<br />
<br />
<br />

<!-- ================================================================================= -->

# Config Options

## paths
An array of path strings pointing to directories to search within. Defaults to the current 
directory.
```ts
finder({
    paths: [ './my/content', 'dist/bin' ],
})
```
<br />

## ignorePaths
Array of paths to ignore.
```ts
finder({
    ignorePaths: [ 'node_modules', '.git' ]
})
```
<br />

## ignoreTypes
 Array of file types to ignore. Overrides matching `onlyTypes`. 
```ts
finder({
    ignoreTypes: [ 'd.ts', 'config.json' ]
})
```
<br />

## onlyTypes
Only return files that match the provided types. Will be overridden by matching `ignoreTypes`.
```ts
finder({
    onlyTypes: [ 'node_modules', '.git' ]
})
```
<br />

## maxDepth
Maximum depth to recursively search directories during search. A value of 1 will only search 
a single level of nesting. Defaults to 100.
```ts
finder({
    maxDepth: 3
})
```
<br />

## modifiedAfter
Only return files modified after the provided date. 
Accepts any valid date type
```ts
finder({
    modifiedAfter:  
})
```
<br />

## modifiedBefore
O
```ts
finder({
    modifiedBefore: [ 'node_modules', '.git' ]
})
```
<br />

## createdAfter
O
```ts
finder({
    createdAfter: [ 'node_modules', '.git' ]
})
```
<br />

## createdBefore
O
```ts
finder({
    createdBefore: [ 'node_modules', '.git' ]
})
```
<br />

## sortBy
O
```ts
finder({
    sortBy: [ 'node_modules', '.git' ]
})
```
<br />

## sortOrder
O
```ts
finder({
    sortOrder: [ 'node_modules', '.git' ]
})
```











<br />
<br />
<br />
<!-- ================================================================================= -->

# Date Formats

The properties that accept dates like `createdBefore` or `modifiedAfter` can accept any of the
following types and values as valid dates. Any value that is not an instance of `Date` will be passed
as the only argument to the date constructor.

<br />

## Standard Date Formats

| Type | Value | Description |
|:--|:--|:--|
| `Date` | `new Date()` | The object returned from the `Date` constructor. 
| `Date` | `Date.now()` | A timestamp in unix format
| `number` | `1682960778228` | A timestamp in unix format
| `string` | `3/16/23` | A simple date string in any format accepted by the date constructor.

<br />

## Relative Date Formats
| Type | Value | Description |
|:--|:--|:--|
| `number` | `-300` | **Negative** values are interpreted as a negative time offset in seconds (5 minutes)
| `string` | `-5m` | Time strings that begin with `-` are interpreted as a negative offset in seconds and supports time units `d` days, `h` hours, `m` minutes, or the default of seconds.


```ts
// Find files modified within the last 5 days
finder({
    modifiedAfter: '-5d',
})

// Find files modified within the last day
// but not within the last ten minutes
finder({
    modifiedAfter: '-1d',
    modifiedBefore: '-10m'
})
```




<br />
<br />
<br />
<!-- ================================================================================= -->

# File Extensions

Files with no extension will be treated as `txt` plain text files.
Dot files (.env, .gitignore) will be treated as `.` dot files.
File types should not include leading periods unless referencing 
a 'dot' file like `.gitignore`.

The following values are all valid file types/extensions for finder:
```js
d.ts    // types.d.ts
json    // package.json
lock    // yarn.lock
test.ts // unit.test.ts
ts      // test.ts
```






<br />
<br />
<br />
<!-- ================================================================================= -->

# Types

## Finder
```ts
```

## FinderConfig
```ts
```

## FinderReturn

```ts
```

## FinderFileStat
```ts
```

## SortMethod
```ts
```

## SortOrder
```ts
```
 







<br />
<br />
<br />

# License

**MIT**
This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for the full text.
