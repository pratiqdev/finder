const { expect } = require('chai')
const finder = require("../index.js")
const mockFs = require('mock-fs')




const returnTest = (data) => {
    // console.log('dirMap:', JSON.stringify(data.dirMap, null, 2))
    // T_FinderReturn
    expect(typeof data).to.eq('object')
    expect(typeof data.dirMap).to.eq('object')
    expect(typeof data.length).to.eq('number')
    expect(typeof data.baseDir).to.eq('string')
    expect(Array.isArray(data.types)).to.eq(true)
    expect(Array.isArray(data.names)).to.eq(true)
    expect(Array.isArray(data.files)).to.eq(true)
    expect(!Array.isArray(data.newest) && typeof data.newest === 'object').to.eq(true)
    expect(!Array.isArray(data.oldest) && typeof data.oldest === 'object').to.eq(true)


    // T_FinderFileStat
    const file1 = data.files[0]
    expect(typeof file1.path).to.eq('string')
    expect(typeof file1.name).to.eq('string')
    expect(typeof file1.type).to.eq('string')
    expect(typeof file1.size).to.eq('number')
    // expect(Object.prototype.toString.call(file1.atime)).to.eq('[object Date]')
    // expect(Object.prototype.toString.call(file1.btime)).to.eq('[object Date]')
    // expect(Object.prototype.toString.call(file1.ctime)).to.eq('[object Date]')
    // expect(Object.prototype.toString.call(file1.mtime)).to.eq('[object Date]')
    expect(Object.prototype.toString.call(file1.created)).to.eq('[object Date]')
    expect(Object.prototype.toString.call(file1.modified)).to.eq('[object Date]')
}

const createOffsetDate = (offset) => new Date(Date.now() - (offset * 1000))

const createMockFileWithDate = (date) => mockFs.file({
    birthtime: date,
    mtime: date,
    ctime: date,
    atime: date,
})


module.exports = {
    finder,
    expect,
    mockFs,
    returnTest,
    createMockFileWithDate,
    createOffsetDate,
}
