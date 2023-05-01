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

const counter = {
    value: 1,
    inc: (str) => `${counter.value++} ${str}`,
    reset: () => counter.value = 0,
}

const createOffsetDate = (offset) => {

    let ms;
    if (typeof offset === 'number'  && timestamp < 0) {
        // usage of a number will always refer to negative time travel
        ms = Math.abs(offset * 1000);
    } else if (typeof offset === 'string' && offset.startsWith('-')) {
        // only parse time strings this way if they start with '-'
        const match = offset.match(/(-?\d+)([dhm])/);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2];
            console.log(`Creating offset date from ${value}:${unit}`)
            switch (unit) {
                case 'd':
                    ms = value * 24 * 60 * 60 * 1000;
                    break;
                case 'h':
                    ms = value * 60 * 60 * 1000;
                    break;
                case 'm':
                    ms = value * 60 * 1000;
                    break;
                default:
                    ms = value * 1000;
                    // throw new Error(`Invalid time unit: ${unit}`);
            }
        } else {
            throw new Error(`Invalid time string: ${offset}`);
        }
    } else {
        // throw new Error(`Invalid argument type: ${typeof offset}`);
        let d = new Date(offset)
        console.log(`Invalid offset argument. Returning date:`, d)
        return d
    }
    let d = new Date(Date.now() + ms)
    console.log(`Calculated date: ${ms} =>`, d.toString())
    return d
}

const createMockFileWithDate = (date, symlink) => symlink
? mockFs.symlink({
    path: symlink,
    birthtime: date,
    mtime: date,
    ctime: date,
    atime: date,
})
: mockFs.file({
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
    counter
}
