import {finder} from './dist/index.js'
console.log('>> JS:', finder)

let res = await finder({
    paths: ['misc/DIR_B'],
    replaceBase: '@'
})
console.log(JSON.stringify(res.dirMap))