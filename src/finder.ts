// import {readdir, realpath, lstat} from 'fs/promises'
import { readdirSync, realpathSync, lstatSync } from 'fs'
import path, {resolve} from 'path'
import debug from 'debug'

const log = {
    init: debug('@pq:finder:init'),
    getFiles: debug('@pq:finder:getFiles'),
    type: debug('@pq:finder:type'),
    dates: debug('@pq:finder:dates'),
    filter: debug('@pq:finder:filter'),
    sort: debug('@pq:finder:sort'),
}

// XTODO Finder is using ".gitignore" as a type - it should ignore the period if found at the beginning of the string

const colors = {
    reset:"\x1b[0m",
    bright:"\x1b[1m",
    // dim:"\x1b[2m",
    // underscore:"\x1b[4m",

    // red:"\x1b[31m",
    // green:"\x1b[32m",
    yellow:"\x1b[33m",
    // blue:"\x1b[34m",
    // magenta:"\x1b[35m",
    // cyan:"\x1b[36m",
    // white:"\x1b[37m",
    // grey:"\x1b[2m",

    // RED:"\x1b[31m\x1b[1m",
    // GREEN:"\x1b[32m\x1b[1m",
    // YELLOW:"\x1b[33m\x1b[1m",
    // BLUE:"\x1b[34m\x1b[1m",
    // MAGENTA:"\x1b[35m\x1b[1m",
    // CYAN:"\x1b[36m\x1b[1m",
    // WHITE:"\x1b[37m\x1b[1m",
    // GREY:"\x1b[2m\x1b[1m",
}

export type T_FinderConfig = {

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
    modifiedAfter?: T_FinderDateEntry;

    /** Only return files modified before the provided date.  
     * @example modifiedBefore: '01/24/1991', */
    modifiedBefore?: T_FinderDateEntry;

     /** Only return files created after the provided date.  
     * @example createdAfter: '01/24/1991', */
    createdAfter?: T_FinderDateEntry;

    /** Only return files created before the provided date.  
     * @example createdBefore: '01/24/1991', */
    createdBefore?: T_FinderDateEntry;

    /** Sort the resulting file data by name, date, type, .etc 
     * @example sortBy: 'name' */
    sortBy?: E_FinderSortMethods;

    /** Set the sort order use when sorting by name, size, date, .etc
     * @example sortOrder: 'desc' */
    sortOrder?: E_FinderSortOrders;
}


export type T_FinderFileStat = {
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
export enum E_FinderSortMethods {
    NAME = 'name',
    TYPE = 'type',
    SIZE = 'size',
    CREATED = 'created',
    MODIFIED = 'modified',
}

/** Possible options for sort orders */
export enum E_FinderSortOrders {
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

export type T_Finder = (config?: string | T_FinderConfig) => T_FinderReturn;

/**
 * 
 * @param config 
 * @returns [paths]
 * 
 * @example
 * interface config {
 *     paths: string[];   
 *     ignorePaths?: string[];  
 *     ignoreTypes?: string[];  
 *     onlyTypes?: string[];  
 *     maxDepth?: number;  
 *     modifiedAfter?: string;  
 *     modifiedBefore?: string;  
 *     createdAfter?: string;  
 *     createdBefore?: string;  
 * }
 *
 * const paths = await finder({
 *      paths: ['myFiles', 'other/file.js'],
 *      ignoreTypes: ['test.js'],
 *      modifiedAfter: '03/21/1978'
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * })
 */


const finder: T_Finder = (config: string | T_FinderConfig = { paths: ['.'] }) => {
    const returnable = {
        length: 0,
        types: [],
        names: [],
        files: [],
        newest: null,
        oldest: null,
        baseDir: null,

    }

try{
    // log_main('Accumulating files with config:', config)

    //~                                                                                 
    //~                                                                                 
    //~                                                                                 
    //~                                                                                 

    //Short code
    function matchRuleShort(str:string, rule:string) {
        var escapeRegex = (str:string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    }

    //Explanation code
    // function matchRuleExpl(str:string, rule:string) {
    //     // for this solution to work on any string, no matter what characters it has
    //     var escapeRegex = (str:string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

    //     // "."  => Find a single character, except newline or line terminator
    //     // ".*" => Matches any string that contains zero or more characters
    //     rule = rule.split("*").map(escapeRegex).join(".*");

    //     // "^"  => Matches any string with the following at the beginning of it
    //     // "$"  => Matches any string with that in front at the end of it
    //     rule = "^" + rule + "$"

    //     //Create a regular expression object for matching string
    //     var regex = new RegExp(rule);

    //     //Returns true if it finds a match, otherwise it returns false
    //     return regex.test(str);
    // }

//Examples
// alert(
 

//    "1. " + matchRuleShort("bird123", "bird*") + "\n" +
//     "2. " + matchRuleShort("123bird", "*bird") + "\n" +
//     "3. " + matchRuleShort("123bird123", "*bird*") + "\n" +
//     "4. " + matchRuleShort("bird123bird", "bird*bird") + "\n" +
//     "5. " + matchRuleShort("123bird123bird123", "*bird*bird*") + "\n" +
//     "6. " + matchRuleShort("s[pe]c 3 re$ex 6 cha^rs", "s[pe]c*re$ex*cha^rs") + "\n" +
//     "7. " + matchRuleShort("should not match", "should noo*oot match") + "\n"
// );











    //~                                                                                 
    //~                                                                                 
    //~                                                                                 
    //~                                                                                 
    
    const __dirname = realpathSync('.')
    log.init('Base path:', __dirname)
    
    
    const DEFAULTS = {
        ignorePaths: ['node_modules'],
        ignoreTypes: ['lock'],
    }




    //&                                                                                     SETTINGS
    let SETTINGS:any = {}

    if(typeof config === 'string'){
        SETTINGS = {
            maxDepth:       100,
            paths:          [config],
            ignorePaths:    [],
            ignoreTypes:    [],
            onlyTypes:      [],
            modifiedAfter:  null,
            modifiedBefore: null,
            createdAfter:   null,
            createdBefore:  null,
            sortBy:         E_FinderSortMethods.NAME,
            sortOrder:      E_FinderSortOrders.ASC,
        }
    }else{

        SETTINGS = {
            maxDepth:       config?.maxDepth            ?? 100,
            paths:          config?.paths               ?? [__dirname],
            ignorePaths:    config?.ignorePaths         ?? [],
            ignoreTypes:    config?.ignoreTypes         ?? [],
            onlyTypes:      config?.onlyTypes           ?? [],
            modifiedAfter:  config?.modifiedAfter       ?? null,
            modifiedBefore: config?.modifiedBefore      ?? null,
            createdAfter:   config?.createdAfter        ?? null,
            createdBefore:  config?.createdBefore       ?? null,
            sortBy:         config?.sortBy              ?? null,
            sortOrder:      config?.sortOrder           ?? null
        }
    }
    
    SETTINGS.ignoreTypes.push(...DEFAULTS.ignoreTypes)
    SETTINGS.ignorePaths.push(...DEFAULTS.ignorePaths)
    log.init('Settings:', SETTINGS)


    //&                                                                                        DATES
    var dates = {
        convert:function(d:any) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp) 
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                //@ts-ignore
                d.constructor === Number ? new Date(d) :
                //@ts-ignore
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date || d.day) :
                NaN
            );
        },
        compare:function(a:any,b:any) {
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).

            // convert negative time to past
            if(typeof b === 'number' && b < 0){
                b = Date.now() + (b * 1000)
            }
            return (
                isFinite(a=this.convert(a).valueOf()) &&
                isFinite(b=this.convert(b).valueOf()) ?
                //@ts-ignore
                (a>b)-(a<b) :
                NaN
            );
        },
        inRange:function(d:any,start:any,end:any) {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
           return (
                isFinite(d=this.convert(d).valueOf()) &&
                isFinite(start=this.convert(start).valueOf()) &&
                isFinite(end=this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
            );
        }
    }







    let recurseDepth = 0


    //&                                                                                    GET FILES
    const getFiles = (dir:any) => {
        try{
        log.getFiles('Getting files from path:', dir)
        let dirStat = lstatSync(dir)
        let dirents
        if(dirStat.isDirectory()){
            log.getFiles('Path is directory:', dir)
            dirents = readdirSync(dir, { withFileTypes: true });
        }else{
            log.getFiles('Path is file:', dir)
            dirents = [dir]
        }


        const files:any[] = dirents.map((dirent) => {
            if(
                SETTINGS.ignorePaths.includes(dirent) 
                || SETTINGS.ignorePaths.includes(dirent.name)
            ){
                log.getFiles('Ignoring path:', dirent + ' | ' + dirent.name)
                return;
            }
            // log.getFiles('>>>>>>>>>>>>>>>>>>>>>>>>>>>> dirent:', dirent)
            // let resDir
            // try{
            // }catch(err){
            //     console.log(err)
            // }
            log.getFiles('Resolving:', {
                dir: dirent ? '' : dir,
                name: dirent.name ?? dirent
            })
            const res = resolve(dir === dirent ? '' : dir, dirent.name || dirent);
            let resDir = lstatSync(res)

            log.getFiles('Resolved path:', res)

            if(resDir?.isDirectory()){
                log.getFiles('Path is directory')
                recurseDepth++
                if(recurseDepth < SETTINGS.maxDepth){
                    log.getFiles(`Recursing at depth:`, recurseDepth)
                    return getFiles(res)
                }else{
                    log.getFiles(`Max recurse depth, returning empty array`)
                    return []
                }
            }else{
                
                log.getFiles('Path is directory')
                let finalPath = res.split('/').pop() ?? ''
                let numberOfPeriods = (finalPath.match(/\./g) ?? []).length
                let split = finalPath.split('.')
                let _name = res.split('/').pop()
                let _type
            
                log.getFiles('splitting path:', res.split('/').pop())
                
                if(numberOfPeriods === 0){
                    _type = path.extname(finalPath) !== '' ? path.extname(finalPath) : 'txt'
                    log.type('No period (plaintext). type = ', _type)
                }else if(numberOfPeriods === 1 && finalPath.startsWith('.')){
                    _type = '.'
                    log.type('Dot file (.env, .gitignore). type = ', _type)
                }
                else if(numberOfPeriods === 1){
                    _type = split[split.length - 1]
                    log.type('One period. type =', _type)
                }
                else{
                    // let _split = [...split]
                    // _split.shift()
                    _type = split
                        .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
                        .slice(1)
                        .join('.')

                    log.type('At least one period. type =', _type)
                }



                return {
                    path: res,
                    name: _name,
                    type: _type,
                    size: resDir.size,
                    atime: resDir.atime,
                    btime: resDir.birthtime,
                    ctime: resDir.ctime,
                    mtime: resDir.mtime
                }
            }
        });
        return Array.prototype.concat(...files);
        }catch(ERR){
            const err:any = ERR
            if(err.message && err.message.includes("lstat '")){
                console.log(
                    colors.yellow + `FINDER | PATH ERROR:\n` +
                    colors.reset + `   Unable to locate path ` + 
                    colors.bright + `"${err.message.split("lstat '")[1].replace("'", '')}"\n`+ 
                    colors.reset + `   in ` + 
                    colors.bright + `"${__dirname}"\n` +
                    colors.reset
                )
            }else{
                console.log('FINDER | PATH ERROR:\n', err.message ?? err)
            }
            console.log(ERR)
        }
    }
    






    //&                                                                                       FILTER
    const runFilter = (dir:any) => {
        let files = getFiles(dir) || []
    
        files = files.filter(file => {
            if(!file){
                log.filter('Filtering - no file found')
                return false
            }
            log.filter('Filtering data for file:', file.name)
    
            if(SETTINGS.ignorePaths.includes(file.name) ){ 
                log.filter(`File name ignored via "ignorePaths"`)
                return false;
            }else if(SETTINGS.onlyTypes.length){
                if(SETTINGS.onlyTypes.includes(file.type) ){
                    log.filter(`File type matches "onlyTypes"`)
                    return true;
                }
            }else if(SETTINGS.ignoreTypes.includes(file.type)){
                log.filter(`File type ignored via "ignoreTypes"`)
                return false;
            }else{
                log.filter(`File passed ignore filter`)
                return true;
            }
        })

        files = files.filter(file => {
            if(SETTINGS.modifiedAfter){
                let compare = dates.compare(file.mtime, SETTINGS.modifiedAfter) >= 0 
                log.dates(`Modified after "${SETTINGS.modifiedAfter}" - ${compare}`)
                return compare
            }
            
            if(SETTINGS.modifiedBefore){
                let compare =  dates.compare(file.mtime, SETTINGS.modifiedBefore) <= 0
                log.dates(`Modified before "${SETTINGS.modifiedBefore}" - ${compare}`)
                return compare
            }
            
            if(SETTINGS.createdAfter){
                let compare = dates.compare(file.btime, SETTINGS.createdAfter) >= 0
                log.dates(`Created after "${SETTINGS.createdAfter}" - ${compare}`)
                return compare
            }
            
            if(SETTINGS.createdBefore){
                let compare = dates.compare(file.btime, SETTINGS.createdBefore) <= 0
                log.dates(`Created before "${SETTINGS.createdBefore}" - ${compare}`)
                return compare
            }
            log.dates('No date restrictions set, returning true')
            return true
        })

        return files
    
    }




    //&                                                                                        START
    //$ For each path provided - getFiles and filter
    const files = SETTINGS.paths.map((path:string) => runFilter(path))

    let uniqueFiles:any[] = []
    const filePathMap:string[] = []

    files.flat().forEach((file:any) => {
        if(!filePathMap.includes(file.path)){
            uniqueFiles.push(file)
            filePathMap.push(file.path)
        }
    })

    // log.getFiles('Accumulated files:', uniqueFiles)


    // console.log('1 - ACCUMULATE FILES - DONE')

    //~ SORT UNIQUE FILES                                                                           

    if(SETTINGS.sortBy){
        let sortX = 1
        let sortY = -1
        if(SETTINGS.sortOrder === E_FinderSortOrders.ASC){
            sortX = -1
            sortY = 1
            log.sort('Sort order: ASC')
        }else{
            log.sort('Sort order: DESC')
        }
        
        const normalize = (str:string) => str.toLowerCase()
        // .replace(/\./g, '')

        
        if(SETTINGS.sortBy === E_FinderSortMethods.NAME){
            log.sort('Sorting by: name')
            uniqueFiles = uniqueFiles.sort((a,b) => normalize(a.name) > normalize(b.name) ? sortX : sortY)
        }
        if(SETTINGS.sortBy === E_FinderSortMethods.SIZE){
            log.sort('Sorting by: size')
            uniqueFiles = uniqueFiles.sort((a,b) => a.size > b.size ? sortX : sortY)
        }
        if(SETTINGS.sortBy === E_FinderSortMethods.CREATED){
            log.sort('Sorting by: created date')
            uniqueFiles = uniqueFiles.sort((a,b) => a.ctime > b.ctime ? sortX : sortY)
        }
        if(SETTINGS.sortBy === E_FinderSortMethods.MODIFIED){
            log.sort('Sorting by: modified date')
            uniqueFiles = uniqueFiles.sort((a,b) => a.mtime > b.mtime ? sortX : sortY)
        }
        if(SETTINGS.sortBy === E_FinderSortMethods.TYPE){
            log.sort('Sorting by: type')
            uniqueFiles = uniqueFiles.sort((a,b) => normalize(a.type) > normalize(b.type) ? sortX : sortY)
        }
    }



    let newest:any = null
    let oldest:any = null
    let names:string[] = []
    let types: string[] = []

    uniqueFiles.forEach(file => {
        names.push(file.name)

        if(!newest || file.mtime > newest.mtime){ newest = file }
        if(!oldest || file.mtime < newest.mtime){ oldest = file }

        if(!types.includes(file.type)){
            types.push(file.type)
        }
    })






    return {
        length: uniqueFiles.length,
        baseDir: __dirname,
        types,
        names,
        newest,
        oldest,
        files: uniqueFiles

    }

}catch(ERR){
    const err:any = ERR
    console.log(
        colors.yellow + `FINDER | ERROR:\n` + err.message || err
    )
    console.log(ERR)
    return returnable
}
}


export default finder