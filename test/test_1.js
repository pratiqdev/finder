import {expect} from 'chai'
//@ts-ignore
import finder from '../index.js'



const returnTest = (data) => {
    // console.log('dirMap:', JSON.stringify(data.dirMap, null, 2))
     // T_FinderReturn
     expect(typeof data).to.eq('object')
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
    expect(Object.prototype.toString.call(file1.atime)).to.eq('[object Date]')
    expect(Object.prototype.toString.call(file1.btime)).to.eq('[object Date]')
    expect(Object.prototype.toString.call(file1.ctime)).to.eq('[object Date]')
    expect(Object.prototype.toString.call(file1.mtime)).to.eq('[object Date]')
}




describe('finder | import', () => {

    it('Provides a function exported as default', () => {
        expect(typeof finder).to.eq('function')
    })

    it('Provides a function that does not throw', () => {
        expect(() => finder()).to.not.throw()
    })

})

describe.only('finder | results', () => {

    it('finder() | Returns a result object with no arguments', async () => {
        const data = await finder()
        returnTest(data)
    })

    it('finder("../myPath") | Returns a result object with a string path argument', async () => {
        const data = await finder('misc')
        returnTest(data)
    })


})

describe('finder | dirtMap', () => {

    it('finder() | Returns a directory map in the results object', async () => {
        const data = await finder()
        returnTest(data)
        // console.log(data.dirMap)
    })

})


describe('finder | advanced config', () => {

    it.skip('path: finds files within the provided paths')
    it.skip('ignorePaths: ignores files within the provided paths')
    it.skip('ignoreTypes: ignores provided types')
    it.skip('onlyTypes: returns only files matching provided types')
    it.skip('onlyTypes: if ignoreTypes has same value as onlyTypes - choose correctly')
    it.skip('maxDepth: stops recursion at the provided depth')
    
    // use fs to append to file
    it.skip('modifiedAfter: only return files modified after the provided date') 

    it.skip('modifiedBefore: only return files modified after the provided date') 

    // use fs to create a file (create an empty directory that can hold this file and be purged safely)
    it.skip('createdAfter: only return files modified after the provided date') 

    // use DATE_DO_NOT_EDIT.md file - contains timestamp estimate of creation date
    it.skip('createdBefore: only return files modified after the provided date') 
    
    
    it.skip('sortBy: test that all sort methods work correctly')
    it.skip('sortOrder: test asc/desc sort orders')

})