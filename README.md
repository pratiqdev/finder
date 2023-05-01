

<h3 align="center"><b>finder</b></h3>

<h4 align="center">

Easily find and accumulate files by name, size, date and type.  

[Installation](#installation)
&nbsp;•&nbsp;
[Usage](#usage)
&nbsp;•&nbsp;
[Config](#config-options)
&nbsp;•&nbsp;
[Dates](#date-formats)
&nbsp;•&nbsp;
[Extensions](#file-types--extensions)
&nbsp;•&nbsp;
[API](#api)

</h4>








<br />
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

View the method definitions and examples below to get an idea of how to use the config
parameters. Check the [Type Definitions](#type-definitions) to look deeper into accepted
values and types.



## paths
An array of path strings pointing to directories to search within. Defaults to the current 
directory.   
Default: `['.']  process.cwd()`
```ts
finder({
    paths: [ './my/content', 'dist/bin' ],
})
```
<br />

## ignorePaths
Array of paths to ignore.  
Default: `['node_modules', '.git']`
```ts
finder({
    ignorePaths: [ 'node_modules', '.git' ]
})
```
<br />

## ignoreTypes
Array of file types to ignore. Overrides matching `onlyTypes`.  
default: `['lock', '.gitignore']`
```ts
finder({
    ignoreTypes: [ 'd.ts', 'config.json' ]
})
```
<br />

## onlyTypes
Only return files that match the provided types. Will be overridden by matching `ignoreTypes`.  
Default: `[]`
```ts
finder({
    onlyTypes: [ 'md', 'json' ]
})
```
<br />

## maxDepth
Maximum depth to recursively search directories during search. A value of 1 will only search 
a single level of nesting.  
Default: `100`
```ts
finder({
    maxDepth: 3
})
```
<br />

## modifiedAfter
Only return files modified after the provided date.  
default: `null`
```ts
finder({
    modifiedAfter:  '-10m'
})
```
<br />

## modifiedBefore
Only return files modified before the provided date.  
default: `null`
```ts
finder({
    modifiedBefore: '2008/1/1'
})
```
<br />

## createdAfter
Only return files created after the provided date.  
default: `null`
```ts
finder({
    createdAfter: 1682971265216
})
```
<br />

## createdBefore
Only return files created before the provided date.  
default: `null`
```ts
finder({
    createdBefore: -60_000
})
```
<br />

## sortBy
The property used to sort the resulting files array, or maintain insertion order.  
Default: `null`
```ts
finder({
    sortBy: 'name'
})
```
<br />

## sortOrder
The order used to sort the resulting files array, or maintain insertion order.  
Default: `null`
```ts
finder({
    sortOrder: 'desc'
})
```

## replaceBase
A string used to replace the baseUrl or root dir of the paths searched. Helps in reducing `dirMap` 
complexity and `stat.path` length.  
Default: `null`
```ts
finder({
    replaceBase: '@'
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

**⚠️ DATES ARE FORWARD INCLUSIVE**

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

# File Types / Extensions

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

# API

```ts
export type Finder = (config?: string | FinderConfig) => FinderReturn;
```
<br />
<br />


## Config Properties

| Property | Type | Description
|:--|:--|:--|
paths | `string[]` | Array of paths to search within
ignorePaths | `string[]` | Ignore file paths
ignoreTypes | `string[]` | Ignore file types
onlyTypes | `string[]` | Only return matching types
maxDepth | `number` | Maximum directory search depth
modifiedAfter | `Date` | Only return files modified after provided date
modifiedBefore | `Date` | Only return files modified before provided date
createdAfter | `Date` | Only return files created after provided date
createdBefore | `Date` | Only return files created before provided date
sortBy | `SortMethod` | Sort the results with the provided method
sortOrder | `SortOrder` | Sort the results in ascending or descending order
replaceBase | `string` | Replace the common baseUrl with a short string


```ts
const fileData = finder({
    paths: ['./my/content/'],
    onlyTypes: ['md', 'json'],
    modifiedAfter: '-20m',
    sortBy: 'date',
    sortOrder: 'desc',
    ...
})
```

<br />
<br />

## Return Values

| Property | Type | Description
|:--|:--|:--|
length | `number` | Number of files accumulated
files | `FinderStat[]` | Array of resulting file data
newest | `FinderStat` | The most recently modified or created file
oldest | `FinderStat` | The least recently modified or created file
names | `string[]` | Array of file names with no leading path
types | `string[]` | Unique list of types found
baseDir | `string` | Base directory path that was searched
dirMap | `Object` | A map of the directory structure where values are file maps or path strings


```ts
const {
    files,
    newest,
    dirMap,
    baseDir,
    ...
} = finder()
```

<br />
<br />

## Type Definitions

### `FinderConfig`
```ts
export type Finder = (config?: string | FinderConfig) => FinderReturn;

export type FinderConfig = {
    // Array of path strings to search within 
    // default: `.` (current directory)
    // @example paths: ['myDir', '../../this-whole-dir'],
    paths: string[];

    // Array of paths to ignore 
    // default: `['node_modules', '.git']`
    // @example ignorePaths: ['../tests'],
    ignorePaths?: string[];
     
    // Array of file types to ignore.
    // default: `['lock']`
    // @example ignoreTypes: ['test.js'], */
    ignoreTypes?: string[];

    // Only return files that match the provided types.
    // default: `[]`
    // @example onlyTypes: ['md', 'txt'], */
    onlyTypes?: string[];

    // Maximum depth to search nested directories.  
    // default: `100`.
    // @example maxDepth: 8, */
    maxDepth?: number;

    // Only return files modified after the provided date.  
    // Accepts any valid date string or object (exclusive)
    // default: `null`
    // @example 
    // modifiedAfter: '01/24/1991'
    // modifiedAfter: 1641076200
    // modifiedAfter: '-20m'
    modifiedAfter?: Date;

    // Only return files modified before the provided date.  
    // Accepts any valid date string or object (exclusive)
    // default: `null`
    // @example 
    // modifiedAfter: '01/24/1991'
    // modifiedAfter: 1641076200
    // modifiedAfter: '-20m'
    modifiedBefore?: Date;
     
    // Only return files created after the provided date.  
    // Accepts any valid date string or object (exclusive)
    // default: `null`
    // @example 
    // modifiedAfter: '01/24/1991'
    // modifiedAfter: 1641076200
    // modifiedAfter: '-20m'
    createdAfter?: Date;
      
    // Only return files created before the provided date. 
    // Accepts any valid date string or object (exclusive)
    // default: `null`
    // @example 
    // modifiedAfter: '01/24/1991'
    // modifiedAfter: 1641076200
    // modifiedAfter: '-20m'
    createdBefore?: Date;
     
    // Sort the resulting file data by name, date, type, .etc 
    // default: `null`
    // @example 
    // sortBy: 'name', 
    // sortBy: 'size', 
     sortBy?: SortMethod;
     
    // Set the sort order used when sorting
    // @example 
    // sortOrder: 'desc',
    // sortOrder: 'asc',
    sortOrder?: SortOrder;
     
    // Replace the full file path with this string/path
    // default: `null`
    // @example replaceBase: '<base>/'
    // outputs: '<base>/path/to/file.txt'
    replaceBase?: string;
}
```
<br />

### `FinderReturn`
```ts
export type FinderReturn =  {
    // Total number of files accumulated
    length: number;

    // Base directory of file search
    baseDir: null | string;

    // Array of file types accumulated
    types: string[];

    // Array of file names accumulated
    names: string[];

    // Array of resulting file data
    files: FinderStat[];

    // The most recently modified or created file
    newest: null | FinderStat;

    // The least recently modified or created file
    oldest: null | FinderStat;

    // A map of the directory structure where 
    // values are file maps or path strings
    dirMap: Object;
}
```
<br />


### `FinderStat`
```ts
export type FinderStat = {
    // Full path to the file
    path: string;

    // File name - split at last '/' 
    name: string;

    // Inferred file type
    type: string;

    // File size (in bytes)
    size: number;
    
    // Last file modification date
    modified: Date;

    // File created date
    created: Date;
}
```
<br />


### `SortMethod`
```ts
// Possible options for sort methods 
export type SortMethod = 'name' | 'size' | 'type' | 'created' | 'modified' | 'date'
```
<br />


### `SortOrder`
```ts
// Possible options for sort orders 
export type SortOrder = 'asc' | 'desc'
```
 





<br />
<br />
<br />

# Overview

Finder filters paths and types while recursively parsing directory contents 
and file stats to accumulate rich file data. If you need a **fast and simple** file matcher
for file paths only, try [globby](https://www.npmjs.com/package/globby).





<br />
<br />
<br />

# License

**MIT**
This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file 
for the full text.
