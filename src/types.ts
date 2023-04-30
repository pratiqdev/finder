/**
 * Config object for finder
 * 
 * | Property | Type | Description
 * |:--|:--|:--|
 * paths | `string[]` | Array of paths to search within
 * ignorePaths | `string[]` | Ignore file paths
 * ignoreTypes | `string[]` | Ignore file types
 * onlyTypes | `string[]` | Only return matching types
 * maxDepth | `number` | Maximum directory search depth
 * modifiedAfter | `Date` | Only return files modified after provided date
 * modifiedBefore | `Date` | Only return files modified before provided date
 * createdAfter | `Date` | Only return files created after provided date
 * createdBefore | `Date` | Only return files created before provided date
 * sortBy | `SortMethod` | Sort the results with the provided method
 * sortOrder | `SortOrder`
 * replaceBase
 * 
 * 
 * 
 * 
 */
export type FinderConfig = {

    /** Array of path strings to search within 
     * default: '.' (current directory)
     * @example paths: ['myDir', '../../this-whole-dir'], */
    paths: string[];

    /** Array of paths to ignore 
     * default: ['node_modules', '.git']
     * @example ignorePaths: ['../tests'], */
     ignorePaths?: string[];
     
     /** Array of file types to ignore.
     * default: ['lock']
     * @example ignoreTypes: ['test.js'], */
    ignoreTypes?: string[];

    /** Only return files that match the provided types.
     * default: []
     * @example onlyTypes: ['md', 'txt'], */
    onlyTypes?: string[];

    /** Maximum depth to recursively search directories during search.  
     * default: 100.
     * @example maxDepth: 8, */
    maxDepth?: number;

    /** Only return files modified after the provided date.  
     * default: null
     * @example modifiedAfter: '01/24/1991', */
    modifiedAfter?: Date;

    /** Only return files modified before the provided date.  
     * default: null
     * @example modifiedBefore: '01/24/1991', */
     modifiedBefore?: Date;
     
     /** Only return files created after the provided date.  
      * default: null
      * @example createdAfter: '01/24/1991', */
      createdAfter?: Date;
      
     /** Only return files created before the provided date. 
     * Accepts any valid date string or object
     * default: null
     * @example 
     * createdBefore: new Date(...)
     * createdBefore: '01/24/1991'
     * createdBefore: 1641076200
     * createdBefore: 'Sun, 30 Apr 2023 15:30:00 GMT' // RFC 2822
     * createdBefore: yyyy-mm-ddTHH:MM:ss.sssZ // ISO 8601
     */
     createdBefore?: Date;
     
     /** Sort the resulting file data by name, date, type, .etc 
      * default: null
      * @example 
      * sortBy: 'name', 
      * sortBy: 'size', 
      * */
     sortBy?: SortMethod;
     
     /** Set the sort order use when sorting by name, size, date, .etc
      * @example 
      * sortOrder: 'desc',
      * sortOrder: 'asc',
      */
     sortOrder?: SortOrder;
     
     /** Replace the full file path with this string/path
     * default: null
     * @example replaceBase: '<base>/'
     * outputs: '<base>/path/to/file.txt'
     */
    replaceBase?: string;
}




/** Possible options for sort orders */
export type SortOrder = 'asc' | 'desc'
/** Possible options for sort methods */
export type SortMethod = 'name' | 'size' | 'type' | 'created' | 'modified' | 'date'


export type FinderFileStat = {
    /** Full path to the file */
    path: string;

    /** File name - split at last '/' */
    name: string;

    /** Inferred file type */
    type: string;

    /** File size (in bytes) */
    size: number;
    
    /** Last file modification date */
    modified: Date;

    /** File created date */
    created: Date;
}

export type FinderReturn =  {
    /** Total number of files accumulated */
    length: number;

    /** Base directory of file search */
    baseDir: null | string;

    /** Array of file types accumulated */
    types: string[];

    /** Array of file names accumulated */
    names: string[];

    /** Array of resulting file data */
    files: FinderFileStat[];

    /** The most recently modified or created file */
    newest: null | FinderFileStat;

    /** The least recently modified or created file */
    oldest: null | FinderFileStat;

}

export type Finder = (config?: string | FinderConfig) => FinderReturn;
