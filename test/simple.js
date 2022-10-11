import finder from '../index.js'

const data = finder({
    // paths: ['../../@utils'],
    // maxDepth: 2,
    // onlyTypes: ['config.test.js']
    // ignoreTypes: ['config.test.js'],
    // modifiedAfter: -10,
    // sortBy: 'type',
    // sortOrder: 'asc'
    onlyTypes: ['json'],
    ignoreTypes: ['json']
})

console.log(data.names)
// console.log(data.files.map(x => x.type))
// // console.log(data.files)


// console.log(finder('./dist'))


console.log(finder())