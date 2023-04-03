import { readdirSync, realpathSync, lstatSync, statSync } from 'fs'
import { readdir, realpath, lstat, stat } from 'fs/promises'
import {resolve, join, extname, basename } from 'path'

import { Finder, FinderConfig, FinderSortMethods, FinderSortOrders, DirtMap } from './types.js'
import { log, colors } from './utils.js'
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


export const finder: Finder = async (config: string | FinderConfig = { paths: ['.'] }) => {
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

    function matchRuleShort(str:string, rule:string) {
        var escapeRegex = (str:string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    }




    const __dirname = await realpath('.')
    log.init('Base path:', __dirname)
    
    
    const DEFAULTS = {
        ignorePaths: ['node_modules', '.git'],
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
            sortBy:         FinderSortMethods.NAME,
            sortOrder:      FinderSortOrders.ASC,
            replaceBase:    null
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
            sortOrder:      config?.sortOrder           ?? null,
            replaceBase:    config?.replaceBase         ?? null
        }
    }
    
    SETTINGS.ignoreTypes.push(...DEFAULTS.ignoreTypes)
    SETTINGS.ignorePaths.push(...DEFAULTS.ignorePaths)
    log.init('Settings:', SETTINGS)


    //&                                                                                        DATES
    var dates = {
        convert:function(d:any) {

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
                    _type = extname(finalPath) !== '' ? extname(finalPath) : 'txt'
                    log.type('No period (plaintext). type = ', _type)
                }else if(numberOfPeriods === 1 && finalPath.startsWith('.')){
                    _type = _name
                    log.type('Dot file (.env, .gitignore). type = ', _type)
                }
                else if(numberOfPeriods === 1){
                    _type = split[split.length - 1]
                    log.type('One period. type =', _type)
                }
                else{
                    _type = split
                        .filter(Boolean) // removes empty extensions (e.g. `filename.......txt`)
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
            log.filter('Filtering data for file:', file.name, 'with file type:', file.type)

            if(SETTINGS.ignoreTypes.includes(file.type)){
                log.filter(`File type ignored via "ignoreTypes"`)
                return false;
            }
    
            if(SETTINGS.ignorePaths.includes(file.name) ){ 
                log.filter(`File path ignored via "ignorePaths"`)
                return false;
            }
            
            if(SETTINGS.onlyTypes.length){
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

    const baseDirRegExp = new RegExp(__dirname, 'g')
    let uniqueFiles:any[] = []
    const filePathMap:string[] = []

    files.flat().forEach((file:any) => {
        if(!filePathMap.includes(file.path)){
            uniqueFiles.push(SETTINGS.replaceBase ? { ...file, path: file.path.replace(baseDirRegExp, SETTINGS.replaceBase)} : file)
            filePathMap.push(file.path)
        }
    })

    // log.getFiles('Accumulated files:', uniqueFiles)


    // console.log('1 - ACCUMULATE FILES - DONE')

    //~ SORT UNIQUE FILES                                                                           

    if(SETTINGS.sortBy){
        let sortX = 1
        let sortY = -1
        if(SETTINGS.sortOrder === FinderSortOrders.ASC){
            sortX = -1
            sortY = 1
            log.sort('Sort order: ASC')
        }else{
            log.sort('Sort order: DESC')
        }
        
        const normalize = (str:string) => str.toLowerCase()
        // .replace(/\./g, '')

        
        if(SETTINGS.sortBy === FinderSortMethods.NAME){
            log.sort('Sorting by: name')
            uniqueFiles = uniqueFiles.sort((a,b) => normalize(a.name) > normalize(b.name) ? sortX : sortY)
        }
        if(SETTINGS.sortBy === FinderSortMethods.SIZE){
            log.sort('Sorting by: size')
            uniqueFiles = uniqueFiles.sort((a,b) => a.size > b.size ? sortX : sortY)
        }
        if(SETTINGS.sortBy === FinderSortMethods.CREATED){
            log.sort('Sorting by: created date')
            uniqueFiles = uniqueFiles.sort((a,b) => a.ctime > b.ctime ? sortX : sortY)
        }
        if(SETTINGS.sortBy === FinderSortMethods.MODIFIED){
            log.sort('Sorting by: modified date')
            uniqueFiles = uniqueFiles.sort((a,b) => a.mtime > b.mtime ? sortX : sortY)
        }
        if(SETTINGS.sortBy === FinderSortMethods.TYPE){
            log.sort('Sorting by: type')
            uniqueFiles = uniqueFiles.sort((a,b) => normalize(a.type) > normalize(b.type) ? sortX : sortY)
        }
    }
    


    let newest:any = null
    let oldest:any = null
    let names:string[] = uniqueFiles.map(x => x.name)
    let types: string[] = []

    
    
    const fileDirectoryMap:any = {};
    
    uniqueFiles.forEach((file) => {
        if(!newest || file.mtime > newest.mtime){ newest = file }
        if(!oldest || file.mtime < newest.mtime){ oldest = file }
    
        if(!types.includes(file.type)){
            types.push(file.type)
        }

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
            
            // if (currentObj[pathSegment]) {
                // currentObj = file;
            // }
        });

     
    });
    
    
    // uniqueFiles.forEach((file) => {
    //     let filePath
    //     if(SETTINGS.replaceBase){
    //         filePath = file.path.replace(baseDirRegExp, SETTINGS.replaceBase).split('/');
    //     }else{
    //         filePath = file.path.split('/');
    //     }
    //     let currentObj = fileDirectoryMap;
        
    //     filePath.forEach((pathSegment:any, index:number) => {
    //       if (!currentObj[pathSegment]) {
    //         currentObj[pathSegment] = {};
    //       }
    //       currentObj = currentObj[pathSegment];
          
    //       if (index === filePath.length - 1) {
    //         currentObj = file.isFile() ? file.path : file;
    //       }
    //     });
      
    //     if (!newest || file.mtime > newest.mtime) {
    //       newest = file;
    //     }
    //     if (!oldest || file.mtime < newest.mtime) {
    //       oldest = file;
    //     }
      
    //     if (!types.includes(file.type)) {
    //       types.push(file.type);
    //     }
    //   });




        // uniqueFiles.forEach(file => {
        //     const path = file.isDirectory ? file.path : file.dirname;
        //     const parts = path.split('/')
        //     let obj = fileDirectoryMap;
        //     for (let i = 0; i < parts.length; i++) {
        //         const part = parts[i];
        //         if (part === '') continue;
        //         if (!obj[part]) {
        //             obj[part] = {};
        //         }
        //         obj = obj[part];
        //     }
        //     if (file.isFile) {
        //         obj[file.name] = file.path;
        //     }
        // });

    //     // Remove empty directory objects
    //     function removeEmptyDirectories(obj:any) {
    //         Object.keys(obj).forEach(key => {
    //             if (typeof obj[key] === 'object') {
    //                 removeEmptyDirectories(obj[key]);
    //                 if (Object.keys(obj[key]).length === 0) {
    //                     delete obj[key];
    //                 }
    //             }
    //         });
    //     }

    // removeEmptyDirectories(fileDirectoryMap);


    // const dirtMap:DirtMap = async (path = ".") =>
    //     (await stat(path)).isFile ()
    //       ? SETTINGS.replaceBase ? String (await realpath(path)).replace(baseDirRegExp, SETTINGS.replaceBase) : String (await realpath(path))
    //       : Promise
    //           .all
    //             ( (await readdir(path, { withFileTypes: true }))
    //                 .filter(p => {
    //                     let ext = extname(p.name)
    //                     ext = ext.startsWith('.') ? ext.substring(1, ext.length) : ext
    //                     ext = ext === '' ? p.name : ext

    //                     log.filter(`>> Testing dirtmap file: ${p.name} with ext: ${ext}`)
    //                     if(
    //                         SETTINGS.ignorePaths.includes(path)
    //                         || SETTINGS.ignorePaths.includes(p.name)
    //                         || SETTINGS.ignoreTypes.includes(ext)
    //                         || SETTINGS.ignorePaths.includes(join(path, p.name))
    //                         || (SETTINGS.onlyTypes.length && ext && !SETTINGS.onlyTypes.includes(ext))
    //                     ){
    //                         log.filter(`dirMap excluded file: ${p.name}`)
    //                         return false
    //                     }
    //                     // if(extname(p.name) && names.includes(p.name)){
    //                         log.filter(`dirMap accepted file: ${p.name} with extension: ${ext}`)
    //                         return true
    //                     // }else{
    //                     //     log.filter(`>>>> File "${p.name}" DOES NOT exist in uniqueFiles - excluding from dirMap`)
    //                     //     return false
    //                     // }

    //                 })
    //                 .map( p => 
    //                     dirtMap(join (path, p.name))
    //                     .then (obj => names.includes(p.name) ? ({ [p.name]: obj }) : ({}))
    //                 )
    //             )
    //             .then (results => {
    //                 // console.log('assigning results:', results)
    //                 try{
    //                     //@ts-ignore
    //                     results = results ? Object.assign(...results) : {}
    //                     return results
    //                 }catch(err){
    //                     return {}
    //                 }
    //             })

    


    //~
    // type DirtMap = (path: string) => Promise<{ [key: string]: any }>;

    // const dirtMap: DirtMap = async (path = ".") => {
    // const fileMap: { [key: string]: any } = {};

    // if ((await stat(path)).isFile()) {
    //     const realPath = await realpath(path);
    //     const filePath = SETTINGS.replaceBase
    //     ? String(realPath).replace(baseDirRegExp, SETTINGS.replaceBase)
    //     : String(realPath);
    //     const ext = extname(path).replace(/^\./, "");
    //     if (names.includes(path) && !SETTINGS.ignoreTypes.includes(ext)) {
    //     fileMap[basename(path, `.${ext}`)] = filePath;
    //     }
    // } else {
    //     const children = await readdir(path, { withFileTypes: true });
    //     const childPromises = children
    //     .filter(
    //         (child) =>
    //         !SETTINGS.ignorePaths.includes(path) &&
    //         !SETTINGS.ignorePaths.includes(child.name) &&
    //         !SETTINGS.ignorePaths.includes(join(path, child.name))
    //     )
    //     .map(async (child) => {
    //         const childPath = join(path, child.name);
    //         const ext = extname(child.name).replace(/^\./, "");
    //         if (
    //         child.isDirectory() ||
    //         (names.includes(childPath) && !SETTINGS.ignoreTypes.includes(ext))
    //         ) {
    //         return dirtMap(childPath).then((obj) => {
    //             if (Object.keys(obj).length > 0) {
    //             fileMap[child.name] = obj;
    //             }
    //         });
    //         }
    //     });

    //     await Promise.allSettled(childPromises);
    // }

    // return fileMap;
    // };

    // const dirtMap:DirtMap = async (path = ".") => {
    //     const files = await readdir(path, { withFileTypes: true });
      
    //     const filteredFiles = files.filter((file) => {
    //       let ext = extname(file.name);
    //       ext = ext.startsWith('.') ? ext.substring(1, ext.length) : ext;
    //       ext = ext === '' ? file.name : ext;
      
    //       if (
    //         SETTINGS.ignorePaths.includes(path) ||
    //         SETTINGS.ignorePaths.includes(file.name) ||
    //         SETTINGS.ignoreTypes.includes(ext) ||
    //         SETTINGS.ignorePaths.includes(join(path, file.name)) ||
    //         (SETTINGS.onlyTypes.length && ext && !SETTINGS.onlyTypes.includes(ext))
    //       ) {
    //         return false;
    //       } else {
    //         return true //names.includes(file.name);
    //       }
    //     });
      
    //     const filePromises = filteredFiles.map((file) => {
    //       const filePath = join(path, file.name);
    //       return dirtMap(filePath).then((obj) => ({
    //         [file.name]: obj
    //       }));
    //     });
      
    //     const results = await Promise.all(filePromises);
      
    //     try {
    //       //@ts-ignore
    //       const mergedResults = Object.assign(...results);
    //       return mergedResults;
    //     } catch (err) {
    //       return {};
    //     }
    //   };
      

    


    //~


    // const dirMap = await dirtMap('.')

    // console.log('>>Created dirMap:', dirMap)





    // async function generateFileMap(fileNames:string[]) {
    //     const fileMap:any = {};
      
    //     await Promise.all(fileNames.map(async (fileName) => {
    //       const filePath = resolve(fileName);
    //       const isDirectory = statSync(filePath).isDirectory();
      
    //       if (isDirectory) {
    //         const directoryContents = await readdir(filePath);
    //         fileMap[fileName] = await generateFileMap(directoryContents.map((directoryItem:any) => join(fileName, directoryItem)));
    //       } else {
    //         fileMap[basename(fileName)] = filePath;
    //       }
    //     }));
      
    //     return fileMap;
    //   }

    //   async function generateFileMap2(fileNames:string[]) {
    //     const fileMap:any = {};
      
    //     await Promise.all(fileNames.map(async (fileName:string) => {
    //       const filePath = resolve(fileName);
    //       const isDirectory = statSync(filePath).isDirectory();
      
    //       if (isDirectory) {
    //         const directoryContents = await readdir(filePath);
    //         fileMap[basename(fileName)] = await generateFileMap(directoryContents.map((directoryItem:string) => join(filePath, directoryItem)));
    //       } else {
    //         fileMap[basename(fileName, extname(fileName))] = filePath;
    //       }
    //     }));
      
    //     return fileMap;
    //   }

    // const directoryPath = __dirname;
    // const directoryContents = await readdir(directoryPath);
    // const fileMap = await generateFileMap2(uniqueFiles.map(f => f.path));




    return {
        length: uniqueFiles.length,
        baseDir: __dirname,
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
        colors.yellow + `FINDER | ERROR:\n` + err.message || err
    )
    console.log(ERR)
    return returnable
}
}


export default finder