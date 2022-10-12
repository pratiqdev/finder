# Finder

**Easily find and accumulate files by name, size, date and type.**

<!-- TODO : add more details to examples, setup, possible issues, contributing -->


<br />

## Usage


Install with your preferred package manager
```
yarn add @pratiq/finder
```



Finder is provided as the default export
```ts
import finder from '@pratiq/finder'
```









<br />

## Simple Example

Get all files within the current directory, or at a specific path.  

`finder()` will return an object containing common stats and the array of files found, like:

**path :** The full path of the file  
**name :** The name of the file  
**size :** The size of the file (in bytes)  

> For more details about the whole return object, check out [T_FinderReturn](#t_finderreturn)  
> For more details about the file data object, check out [T_FinderFileStat](#t_finderfilestat)

```ts
import finder from '@pratiq/finder'

const allFilesInCurrentDir = finder()
const myFiles = finder('../myFiles')

console.log( myFiles.length )
// 3
console.log( myFiles.files[0] )
// T_FinderFileStat {
//    path: '/home/user/Documents/code/myApp/some.config.js',
//    name: 'some.config.js',
//    type: 'config.js',
//    size: 39,
//    atime: 2022-10-11T22:42:20.088Z,
//    btime: 2022-10-11T16:50:37.733Z,
//    ctime: 2022-10-11T22:41:22.419Z,
//    mtime: 2022-10-11T16:50:49.533Z
// }
```


<br />

## Advanced Example

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
    modifiedAfter?: T_FinderDateEntry;

    // Only return files modified before the provided date.  
    // modifiedBefore: '01/24/1991'
    modifiedBefore?: T_FinderDateEntry;

    // Only return files created after the provided date.  
    // createdAfter: '01/24/1991'
    createdAfter?: T_FinderDateEntry;

    // Only return files created before the provided date.  
    // createdBefore: '01/24/1991'
    createdBefore?: T_FinderDateEntry;

    // Sort the resulting file data by name, date, type, .etc 
    // @example sortBy: 'name'
    sortBy?: E_FinderSortMethods;

    // Set the sort order use when sorting by name, size, date, .etc
    // sortOrder: 'desc'
    sortOrder?: E_FinderSortOrders;
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

    // File accessed time 
    atime: Date;
    
    // File birth time 
    btime: Date;
    
    // File created time 
    ctime: Date;
    
    // File modified time
    mtime: Date;
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
```ts
export enum E_FinderSortOrders {
    ASC = 'asc',
    DESC = 'desc'
}
 
//_________________________________________________________________________
 *  Date used for filtering or sorting file data.  
 * 
 * Date object
 * returned without modification
 * 
 * Number  
 * Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp).  
 * Negative numbers are subtracted from Date.now(): `-60 = 60 seconds ago` 
 * 
 * String  
 * Any format supported by the javascript engine, like:   
 * "YYYY/MM/DD",  
 * "MM/DD/YYYY",  
 * "Jan 31 2009",  
 * etc.
 * 
 * Array   
 * Interpreted as [year,month,day].  
 * NOTE: month is 0-11.
 * 
 * Object  
 * Interpreted as an object with year, month and date attributes.  
 * NOTE: month is 0-11.
 */
export type T_FinderDateEntry = Date | string | [number, number, number] | {year:number, month:number, date:number}


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