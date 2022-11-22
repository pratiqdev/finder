
export type DirtMap = (path:string) => Promise<string | { [x: string]: any; } | { [x: string]: { [x: string]: any; }; }>


export type FinderConfig = {

    /** Array of path strings to search within 
     * @example paths: ['myDir', '../../this-whole-dir'], */
    paths: string[];

    /** Array of paths to ignore 
     * @example ignorePaths: ['../tests'], */
    ignorePaths?: string[];

    /** Array of file types to ignore.
     * @example ignoreTypes: ['test.js'], */
    ignoreTypes?: string[];

    /** Only return files that match the provided types.
     * @example onlyTypes: ['md', 'txt'], */
    onlyTypes?: string[];

    /** Maximum depth to recursively search directories during search.  
     * Defaults to 1.
     * @example maxDepth: 8, */
    maxDepth?: number;

    /** Only return files modified after the provided date.  
     * @example modifiedAfter: '01/24/1991', */
    modifiedAfter?: FinderDateEntry;

    /** Only return files modified before the provided date.  
     * @example modifiedBefore: '01/24/1991', */
    modifiedBefore?: FinderDateEntry;

     /** Only return files created after the provided date.  
     * @example createdAfter: '01/24/1991', */
    createdAfter?: FinderDateEntry;

    /** Only return files created before the provided date.  
     * @example createdBefore: '01/24/1991', */
    createdBefore?: FinderDateEntry;

    /** Sort the resulting file data by name, date, type, .etc 
     * @example sortBy: 'name' */
    sortBy?: FinderSortMethods;

    /** Set the sort order use when sorting by name, size, date, .etc
     * @example sortOrder: 'desc' */
    sortOrder?: FinderSortOrders;
}


export type FinderFileStat = {
    /** Full path to the file */
    path: string;

    /** File name - split at last '/' */
    name: string;

    /** Inferred file type */
    type: string;

    /** File size (in bytes) */
    size: number;

    /** File accessed time */
    atime: Date;
    
    /** File birth time */
    btime: Date;
    
    /** File created time */
    ctime: Date;
    
    /** File modified time */
    mtime: Date;
}

/** Possible options for sort methods */
export enum FinderSortMethods {
    NAME = 'name',
    TYPE = 'type',
    SIZE = 'size',
    CREATED = 'created',
    MODIFIED = 'modified',
}

/** Possible options for sort orders */
export enum FinderSortOrders {
    ASC = 'asc',
    DESC = 'desc'
}

/** 
 * Date used for filtering or sorting file data.  
 * 
 * **Date object**  
 * returned without modification
 * 
 * **Number**  
 * Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp).  
 * Negative numbers are subtracted from Date.now(): `-60 = 60 seconds ago` 
 * 
 * **String**  
 * Any format supported by the javascript engine, like:   
 * "YYYY/MM/DD",  
 * "MM/DD/YYYY",  
 * "Jan 31 2009",  
 * etc.
 * 
 * **Array**   
 * Interpreted as [year,month,day].  
 * **NOTE:** month is 0-11.
 * 
 * **Object**  
 * Interpreted as an object with year, month and date attributes.  
 * **NOTE:** month is 0-11.
 */
export type FinderDateEntry = Date | string | [number, number, number] | {year:number, month:number, date:number}


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

export type Finder = (config?: string | FinderConfig) => Promise<FinderReturn>;
