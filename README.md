# Finder

**Easily find and accumulate files by name, size, date and type.**

<!-- TODO : add more details to examples, setup, possible issues, contributing, "why" section -->


<br />

## Installation


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
<hr />
<!-- ================================================================================= -->




## Usage


```ts
import finder from '@pratiq/finder'

const data = finder({
    paths: ['../my/content'],
    ignoreTypes: ['d.ts'],
    modifiedAfter: 
})
```
<br />

### Simple Example

Get all files within the current directory, or at a specific path.  

`finder()` will return an object containing common stats and the array of files found, like:

**path :** The full path of the file  
**name :** The name of the file  
**size :** The size of the file (in bytes)  


```ts
import finder from '@pratiq/finder'

const myFiles = finder('../my/content')

console.log( myFiles.files[0] )
// FileStat {
//    path: '/home/user/Documents/code/myApp/some.config.js',
//    name: 'some.config.js',
//    type: 'config.js',
//    size: 39,
//    created: 2022-10-11T16:50:49.533Z,
//    modified: 2022-10-11T16:50:49.533Z
// }
```


<br />

### Advanced Example

Provide advanced config for ignored paths/types and sorting

```ts
const fileData = finder({
    paths: ['../myFiles', './src'],
    ignoreTypes: ['md', 'd.ts', 'test.js'],
    maxDepth: 10,
    sortBy: 'size',
    sortOrder: 'asc'
})
```


<br />
<hr />
<!-- ================================================================================= -->

## Types

### T_FinderConfig

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

### T_FinderFileStat
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


### E_FinderSortMethods 
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

### E_FinderSortOrders
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