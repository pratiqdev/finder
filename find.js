const finder = require('./index')
console.log('>> JS-REQUIRE:', finder)


const res = finder({
    paths: ['misc/DIR_B'],
    replaceBase: '@'
})

console.log(JSON.stringify(res.dirMap, null, 2))