
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
- [Types](#types)
  - [T\_FinderConfig](#t_finderconfig)
  - [T\_FinderFileStat](#t_finderfilestat)
  - [E\_FinderSortMethods](#e_findersortmethods)
  - [E\_FinderSortOrders](#e_findersortorders)
  - [`asc`](#asc)
  - [Filter](#filter)
    - [File Types](#file-types)
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

## Standard Date Formats

| Type | Value | Description |
|:--|:--|:--|
| `Date` | `new Date()` | The object returned from the `Date` constructor. 
| `Date` | `Date.now()` | A timestamp in unix format
| `number` | `1682960778228` | A timestamp in unix format
| `string` | `3/16/23` | A simple date string in any format accepted by the date constructor.

## Relative Date Formats
| Type | Value | Description |
|:--|:--|:--|
| `number` | `-300` | **Negative** values are interpreted as a negative time offset in seconds (5 minutes)
| `string` | `-20m` | Time strings that begin with `-` and end with `d`, `h`, `m`












<br />
<br />
<br />
<!-- ================================================================================= -->

# Types

## T_FinderConfig

The config object provided to `finder({ ... })`

```ts
export type T_FinderConfig = {

    // Array of path strings to search within 
    // paths: ['myDir', '../../this-whole-dir']
    paths: string[];

    // Array of paths to ignore 
    // ignorePaths: ['../tests']
    ignorePaths?: string[];

    // Array of file types to ignore.
    // oreTypes: ['test.js']
    ignoreTypes?: string[];

    // Only return files that match the provided types.
    // onlyTypes: ['md', 'txt']
    onlyTypes?: string[];

    // Maximum depth to recursively search directories during search. Defaults to 1.  
    // maxDepth: 8
    maxDepth?: number;

    // Only return files modified after the provided date.  
    // modifiedAfter: '01/24/1991'
    modifiedAfter?: Date;

    // Only return files modified before the provided date.  
    // modifiedBefore: '01/24/1991'
    modifiedBefore?: Date;

    // Only return files created after the provided date.  
    // createdAfter: '01/24/1991'
    createdAfter?: Date;

    // Only return files created before the provided date.  
    // createdBefore: '01/24/1991'
    createdBefore?: Date;

    // Sort the resulting file data by name, date, type, .etc 
    // @example sortBy: 'name'
    sortBy?: SortMethod;

    // Set the sort order use when sorting by name, size, date, .etc
    // sortOrder: 'desc'
    sortOrder?: SortOrders;
}
```

## T_FinderFileStat
Object returned for each accumulated file

```ts
export type T_FinderFileStat = {
    // Full path to the file
    path: string;

    // File name - split at last '/' 
    name: string;

    // Inferred file type 
    type: string;

    // File size (in bytes) 
    size: number;

    // File creation date
    created: Date;

    // Last modification date
    modified: Date;
}
```


## E_FinderSortMethods 
Possible options for sort methods

```ts
export enum E_FinderSortMethods {
    NAME = 'name',
    TYPE = 'type',
    SIZE = 'size',
    CREATED = 'created',
    MODIFIED = 'modified',
}
```

## E_FinderSortOrders
Possible options for sort orders

## `asc`

```ts
'asc',
'desc'
}
 

export type T_FinderReturn =  {
    /** Total number of files accumulated */
    length: number;

    /** Base directory of file search */
    baseDir: null | string;

    /** Array of file types accumulated */
    types: string[];

    /** Array of file names accumulated */
    names: string[];

    /** Array of resulting file data */
    files: T_FinderFileStat[];

    /** The most recently modified or created file */
    newest: null | T_FinderFileStat;

    /** The least recently modified or created file */
    oldest: null | T_FinderFileStat;

}

type T_Finder = (config?: string | T_FinderConfig) => T_FinderReturn;

```







<br />

## Filter

### File Types

> Files with no extension will be treated as `txt` plain text files.  
> Dot files (.env, .gitignore) will be treated as `.` dot files

Filter by or ignore any file types. File types should not include leading periods.

```ts
onlyTypes: ['d.ts','config.test.js'],
ignoreTypes: ['js', 'txt', '.']
```


## License

**MIT**