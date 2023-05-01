import { readdirSync, realpathSync, lstatSync, statSync, Stats, readlinkSync, existsSync } from 'fs'
import type { Dirent } from 'fs'
import {resolve, extname, join } from 'path'

import { Finder, FinderConfig, FinderStat } from './types.js'
import { log, colors } from './utils.js'
import { validateConfig } from './validateConfig.js'


















/**
 * 
 * 
 * const data = finder({
 *      paths: ['myFiles', 'other/file.js'],
 *      ignoreTypes: ['test.js'],
 *      modifiedAfter: '03/21/1978',
 * })
 * 
 * const { 
 * 
 * }
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * })
 */


const finder: Finder = (config: string | FinderConfig = { paths: ['.'] }) => {

try{


    const basePath = realpathSync('.')
    log.init('Base path:', basePath)
    
 
    //+ Added support for symlinks
    //! No current logic for recursive link resolving
    //! Add array of visited paths to compare against
    const direntCache:string[] = []

    const getDirents = (_path: string): Array<Dirent | string> => {
        let dirStat: Stats = lstatSync(_path);
        if (dirStat.isSymbolicLink()) {
            // resolve symlink
            const resolvedPath = readlinkSync(_path);
            dirStat = lstatSync(resolvedPath);
            _path = resolvedPath;
        }
        // this is where rcursion starts: try to readdirSync on symlinkA -> contains symlinkB which points to symlinkA
        return dirStat.isDirectory() ? readdirSync(_path, { withFileTypes: true }) : [_path] // [_path];
    }

    const getPathDetails = (dirent: Dirent | string, _path: string): { resolvedPath: string, isDirectory: boolean } => {
        const pathName = (typeof dirent === 'string' ? dirent : dirent.name);
        const resolvedPath: string = resolve(_path === dirent ? '' : _path, pathName);
        const resolvedPathStats: Stats = lstatSync(resolvedPath);
        return { resolvedPath, isDirectory: resolvedPathStats.isDirectory() };
    }

    const getFileData = (resolvedPath: string, resolvedPathStats: Stats) => {
        const finalPath = resolvedPath.split('/').pop() ?? '';
        const split = finalPath.split('.');
        const numberOfPeriods = (finalPath.match(/\./g) ?? []).length;
        let _type;
        if (numberOfPeriods === 0) {
            _type = extname(finalPath) !== '' ? extname(finalPath) : 'txt';
        } else if (numberOfPeriods === 1 && finalPath.startsWith('.')) {
            _type = finalPath;
        } else if (numberOfPeriods === 1) {
            _type = split[split.length - 1];
        } else {
            _type = split.filter(Boolean).slice(1).join('.');
        }
        return {
            path: resolvedPath,
            name: finalPath,
            type: _type,
            size: resolvedPathStats.size,
            modified: resolvedPathStats.mtime,
            created: resolvedPathStats.birthtime ?? resolvedPathStats.ctime
        }
    }




    //&                                                                                     SETTINGS
    let SETTINGS:FinderConfig = { paths: [] }
    
    if(typeof config === 'string'){
        SETTINGS = validateConfig({
            paths: [config]
        })
    }else{
        SETTINGS = validateConfig(config)
    }
    



    //&                                                                                   DATE FUNCS
    var dateFuncs = {
        convert:function(d:any):Date {
            return d instanceof Date ? d : new Date(d)
        },
        compare:function(a:any,b:any) {

            // convert negative time to past
            if(typeof b === 'number' && b < 0){
                b = Date.now() + (b * 1000)
            }
            return (
                isFinite(this.convert(a).valueOf()) &&
                isFinite(this.convert(b).valueOf()) ?
                //@ts-ignore
                (a>b)-(a<b) :
                NaN
            );
        },
        inRange:function(d:any,start:any,end:any) {

           return (
                isFinite(this.convert(d).valueOf()) &&
                isFinite(this.convert(start).valueOf()) &&
                isFinite(this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
            );
        }
    }

    //&                                                                                    GET FILES
    const getFiles = (_path: string) => {
        try {
            log.getFiles('Getting files from path:', _path)
            let direntsArray = getDirents(_path);

            const files: any[] = direntsArray.map((dirent: Dirent | string) => {
                let filePath = typeof dirent === 'string' ? dirent : dirent.name
                // recurseDepth = -1
                if (SETTINGS.ignorePaths?.includes(filePath)) {
                    log.getFiles('Ignoring path:', filePath);
                    return;
                }
                const { resolvedPath, isDirectory } = getPathDetails(dirent, _path);
                log.getFiles('Resolved path:', resolvedPath);
                if (isDirectory) {
                    log.getFiles('Path is directory');
                    // recurseDepth++;
                    let currentDepth = 1
                    if(resolvedPath.includes(basePath)){
                        let pathSegment = resolvedPath?.trim()?.split(basePath)[1] ?? '/' // remove the base from the path
                        let trimmedPath = pathSegment.startsWith('/') // if the path starts with '/' remove it
                            ? pathSegment.substring(1)
                            : pathSegment
                        
                        currentDepth = trimmedPath.split('/').length 
                        // console.log('>>>', currentDepth)
                    }
                    if (SETTINGS.maxDepth && currentDepth <= SETTINGS.maxDepth) {
                        log.getFiles(`Recursing at depth:`, currentDepth);
                        return getFiles(resolvedPath);
                    } else {
                        log.getFiles(`Max recurse depth, returning empty array`);
                        return [];
                    }
                } else {
                    log.getFiles('Path is directory');
                    const resolvedPathStats: Stats = lstatSync(resolvedPath);
                    return getFileData(resolvedPath, resolvedPathStats);
                }
            });

            return Array.prototype.concat(...files);
        } catch (ERR) {
            const err: any = ERR;
            if (err.message && err.message.includes("lstat '")) {
                console.log(
                    colors.yellow + `FINDER | PATH ERROR:\n` +
                    colors.reset + `   Unable to locate path ` +
                    colors.bright + `"${err.message.split("lstat '")[1].replace("'", '')}"\n` +
                    colors.reset + `   in ` +
                    colors.bright + `"${basePath}"\n` +
                    colors.reset
                );
            } else {
                console.log('FINDER | PATH ERROR:\n', err.message ?? err);
            }
            console.log(ERR);
        }
    }

    //&                                                                                       FILTER
    const runFilter = (path:string) => {
        let files = getFiles(path) || []

        files = files.filter(file => {
            if(!file){
                log.filter('Filtering - no file found')
                return false
            }
            log.filter('Filtering data for file:', file.name, 'with file type:', file.type)

            if(SETTINGS.ignoreTypes?.includes(file.type)){
                log.filter(`File type ignored via "ignoreTypes"`)
                return false;
            }
    
            if(SETTINGS.ignorePaths?.includes(file.name) ){ 
                log.filter(`File path ignored via "ignorePaths"`)
                return false;
            }
            
            if(SETTINGS.onlyTypes?.length){
                if(SETTINGS.onlyTypes.includes(file.type) ){
                    log.filter(`File type matches "onlyTypes"`)
                    return true;
                }else{
                    log.filter(`File type does not match "onlyTypes"`)
                    return false
                }
            }else{
                log.filter(`File passed ignore filter`)
                return true;
            }
        })

        if(SETTINGS.createdAfter || SETTINGS.createdBefore || SETTINGS.modifiedAfter || SETTINGS.modifiedBefore){
            log.dates(`Comparing provided dates:`, {
                currentTime: new Date().toString(),
                createdAfter: SETTINGS.createdAfter?.toString(),
                createdBefore: SETTINGS.createdBefore?.toString(),
                modifiedAfter: SETTINGS.modifiedAfter?.toString(),
                modifiedBefore: SETTINGS.modifiedBefore?.toString(),
            })
            
            files = files.filter(file => {
                if(SETTINGS.modifiedAfter){
                    let compare = dateFuncs.compare(file.modified, SETTINGS.modifiedAfter) >= 0 
                    log.dates(`Modified after: ${file.modified} :${compare}`)
                    return compare
                }
                
                if(SETTINGS.modifiedBefore){
                    let compare =  dateFuncs.compare(file.modified, SETTINGS.modifiedBefore) <= 0
                    log.dates(`Modified before: ${file.modified} :${compare}`)
                    return compare
                }
                
                if(SETTINGS.createdAfter){
                    let compare = dateFuncs.compare(file.created, SETTINGS.createdAfter) >= 0
                    log.dates(`Created after: ${new Date(file.created)} : ${compare}`)
                    return compare
                }
                
                if(SETTINGS.createdBefore){
                    let compare = dateFuncs.compare(file.created, SETTINGS.createdBefore) <= 0
                    log.dates(`Created before: ${file.created} : ${compare}`)
                    return compare
                }
                log.dates('No date restrictions set, returning true')
                return true
            })
        }

        return files
    
    }


    log.init(`Accumulating files...`)

    //&                                                                                        START
    const files = SETTINGS.paths.map((path:string) => runFilter(path))

    const baseDirRegExp = new RegExp(basePath, 'g')
    let uniqueFiles:FinderStat[] = []
    const filePathMap:string[] = []

    files.flat().forEach((file:any) => {
        if(!filePathMap.includes(file.path)){
            uniqueFiles.push(SETTINGS.replaceBase ? { ...file, path: file.path.replace(baseDirRegExp, SETTINGS.replaceBase)} : file)
            filePathMap.push(file.path)
        }
    })




    //~ SORT UNIQUE FILES                                                                           

    if(SETTINGS.sortBy){
        let sortX = 1
        let sortY = -1
        if(SETTINGS.sortOrder === 'asc'){
            sortX = -1
            sortY = 1
            log.sort('Sort order: ASC')
        }else{
            log.sort('Sort order: DESC')
        }
        
        const normalize = (str:string) => str.trim().toLowerCase()
        // .replace(/\./g, '')

        
        if(SETTINGS.sortBy === 'name'){
            log.sort('Sorting by: name')
            uniqueFiles = uniqueFiles.sort((a,b) => normalize(a.name) > normalize(b.name) ? sortX : sortY)
        }
        if(SETTINGS.sortBy === 'size'){
            log.sort('Sorting by: size')
            uniqueFiles = uniqueFiles.sort((a,b) => a.size > b.size ? sortX : sortY)
        }
        if(SETTINGS.sortBy === 'created'){
            log.sort('Sorting by: created date')
            uniqueFiles = uniqueFiles.sort((a,b) => a.created > b.created ? sortX : sortY)
        }
        if(SETTINGS.sortBy === 'modified' || SETTINGS.sortBy === 'date'){
            log.sort('Sorting by: modified date')
            uniqueFiles = uniqueFiles.sort((a,b) => a.modified > b.modified ? sortX : sortY)
        }
        if(SETTINGS.sortBy === 'type'){
            log.sort('Sorting by: type')
            uniqueFiles = uniqueFiles.sort((a,b) => normalize(a.type) > normalize(b.type) ? sortX : sortY)
        }
    }
    


    let newest:any = null
    let oldest:any = null
    let names:string[] = []
    let types: string[] = []

// ```js
// let basePath = '/home/shlep/Documents/code/finder/'
// let symPath = './DIR_B/md_B-2.md'
// // actual path: '/home/shlep/Documents/code/finder/misc/DIR_B/md_B-2.md'
// let res = resolve(basePath, symPath)
// ```

    
    const fileDirectoryMap:any = {};

    uniqueFiles = uniqueFiles.map((file: FinderStat) => {
        names.push(file.name)
        if(!newest || file.modified > newest.modified){ newest = file }
        if(!oldest || file.modified < newest.modified){ oldest = file }
        
        if(!types.includes(file.type)){
            types.push(file.type)
        }
        // file.sym = file.path
        if(lstatSync(file.path).isSymbolicLink()){
            console.log('>> Path is symlink:', file.path)
            try{
                if (!existsSync(file.path)) {
                    console.log('>> Raw file path does not exist:', file.path)
                    console.log('>> Attempting readLinkSync...')
                    let symPath = readlinkSync(file.path)
                    console.log('>> Found symlink path:', symPath)
                    
                    console.log('>> Attempting resolve full symlink path...')
                    let resolvedSymPath = ''

                    SETTINGS.paths.forEach(pathSegment => {
                        try{
                            if(resolvedSymPath) return;
                            let resX = resolve(pathSegment)
                            let res1 = resolve(basePath)
                            let res2 = join(...pathSegment.split('/'), ...symPath.split('/'))


                        

                            console.log({
                                resX,
                                res1,
                                res2,
                            })


                            let res = resolve(pathSegment)
                            console.log('>> Joined path:', res)
                            if(existsSync(res)){
                                resolvedSymPath = res
                                console.log('>> Resolved symlink full path:', res)
                            }else{
                                console.log(`>> Resolved symlink does not exist "${res}"... trying again...`)

                            }
                        }catch(err){
                            console.log(`>> Resolved symlink path error:`, err)
                        }
                    })


                    console.log('>> Checking if resolved sym path exists...')
                    if(existsSync(resolvedSymPath)){
                        console.log(`>> Resolved symlink and file does exist:`, resolvedSymPath)
                        file.sym = resolvedSymPath
                    }else{
                        console.log(`>> Resolved symlink does not exist:`, file.path)
                    }
                    console.log('\n')
                }
            }catch(err){
                console.log(`Error getting symlink path:`, err)
            }
        }
        if(SETTINGS.reader){
            file.data = SETTINGS.reader(file)
        }
        return file
    })
    
    uniqueFiles.forEach((file:FinderStat) => {
        let currentObj = fileDirectoryMap;
        let filePath:any
        if(SETTINGS.replaceBase){
            filePath = file.path.replace(baseDirRegExp, SETTINGS.replaceBase).split('/');
        }else{
            filePath = file.path.split('/');
        }
        filePath.forEach((pathSegment:any, index:number) => {
            if (!currentObj[pathSegment]) {
                if(names.includes(pathSegment)){
                    currentObj[pathSegment] = file.path;
                }else{
                    currentObj[pathSegment] = {};
                }
            }
            currentObj = currentObj[pathSegment];
        });
    });

    log.init(`File accumulation and filtering complete.`)
    
    return {
        length: uniqueFiles.length,
        baseDir: basePath,
        dirMap: fileDirectoryMap,
        types,
        names,
        newest,
        oldest,
        files: uniqueFiles

    }

}catch(ERR){
    const err:any = ERR
    console.log(
        colors.yellow + `FINDER | ` + err.message || err
    )
    log.init(ERR)
    return {
        length: 0,
        types: [],
        names: [],
        files: [],
        newest: null,
        oldest: null,
        baseDir: null,
        dirMap: {},
        err,
    }
}
}


export default finder