// import {expect} from 'chai'
//@ts-ignore
// import finder from '../dist/index.js'
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




describe('finder | Function', () => {

    it('Provides a function exported as default', () => {
        expect(typeof finder).to.eq('function')
    })

    it('Provides a function that does not throw', () => {
        expect(() => finder()).to.not.throw()
    })

    it('Returns results when invoked', () => {
        expect(typeof finder()).to.eq('object')
    })

    it('Results contain expected properties', () => {
        const data = finder()
        returnTest(data)
    })
})

describe('finder | Config', () => {
    beforeEach(() => {
        mockFs({
            dir1: {
                'file1.txt': 'content1',
                'file2.js': 'content2',
            },
            dir2: {
                'file3.txt': 'content3',
                'file4.md': 'content4',
                subdir: {
                    'file5.js': 'content5',
                },
            },
            dir3: {
                'file6.txt': 'content6',
                subdir2: {
                    'file7.js': 'content7',
                    subdir3: {
                        'file8.js': 'content8',
                        'file9.js': 'content9',
                    },
                },
            },
            dir4: {
                'file10.txt': 'content10',
                'file11.js': 'content11',
                subdir4: {
                    'file12.js': 'content12',
                    subdir5: {
                        'file13.js': 'content13',
                    },
                    subdir6: {
                        'file14.js': 'content14',
                        'file15.md': 'content14',
                    }
                }

            },
            dir5: {
                'a.md': mockFs.file({
                    btime: new Date("2022-01-01T12:30:00"),
                    mtime: new Date("2022-01-01T12:30:00")
                }),
                'b.md': mockFs.file({
                    btime: new Date("2022-01-01T12:31:00"),
                    mtime: new Date("2022-01-01T12:31:00")
                }),
                'c.md': mockFs.file({
                    btime: new Date("2022-01-01T12:31:01"),
                    mtime: new Date("2022-01-01T12:31:01")
                }),
                'd.md': mockFs.file({
                    btime: new Date("2022-01-01T12:30:00"),
                    mtime: new Date("2022-01-01T12:30:00")
                }),


                'z.md': mockFs.file({
                    btime: new Date("2021-01-03T12:30:00"),
                    mtime: new Date("2021-01-01T12:30:00")
                }),
                'y.md': mockFs.file({
                    btime: new Date("2021-01-02T12:30:00"),
                    mtime: new Date("2021-01-02T12:30:00")
                }),
                'x.md': mockFs.file({
                    btime: new Date("2021-01-01T12:30:00"),
                    mtime: new Date("2021-01-03T12:30:00")
                }),
            }
        });
    });

    afterEach(mockFs.restore);

    it('Searches current directory if no paths(s) provided', () => {
        const f4 = finder()

        expect(f4.files.length).to.greaterThan(9)
        expect(f4.names).to.include('file1.txt')
        expect(f4.names).to.include('file2.js')
        expect(f4.names).to.include('file3.txt')
        expect(f4.names).to.include('file4.md')
        expect(f4.names).to.include('file5.js')
        expect(f4.names).to.include('file6.txt')
        expect(f4.names).to.include('file7.js')
        expect(f4.names).to.include('file8.js')
        expect(f4.names).to.include('file9.js')

    })

    it('Searches for files in the provided path string', () => {
        const f1 = finder('dir1')
        const f2 = finder('dir2')
        const f3 = finder('dir3')

        expect(f1.files.length).to.eq(2)
        expect(f1.names).to.include('file1.txt')
        expect(f1.names).to.include('file2.js')
        
        expect(f2.files.length).to.eq(3)
        expect(f2.names).to.include('file3.txt')
        expect(f2.names).to.include('file4.md')
        expect(f2.names).to.include('file5.js')

        expect(f3.files.length).to.eq(4)
        expect(f3.names).to.include('file6.txt')
        expect(f3.names).to.include('file7.js')
        expect(f3.names).to.include('file8.js')
        expect(f3.names).to.include('file9.js')

    })

    it('Searches for files in the provided array of "paths"', () => {
        const f4 = finder({
            paths: ['dir1', 'dir2', 'dir3']
        })

        expect(f4.files.length).to.eq(9)
        expect(f4.names).to.include('file1.txt')
        expect(f4.names).to.include('file2.js')
        expect(f4.names).to.include('file3.txt')
        expect(f4.names).to.include('file4.md')
        expect(f4.names).to.include('file5.js')
        expect(f4.names).to.include('file6.txt')
        expect(f4.names).to.include('file7.js')
        expect(f4.names).to.include('file8.js')
        expect(f4.names).to.include('file9.js')

    })

    it('Ignores files at specified paths by "ignorePaths"', () => {
        const f1 = finder({
            paths: ['dir4'],
            ignorePaths: ['subdir6']
        })

        expect(f1.names).to.include('file10.txt')
        expect(f1.names).to.include('file11.js')
        expect(f1.names).to.include('file12.js')
        expect(f1.names).to.include('file13.js')
        expect(f1.names).to.not.include('file14.js')
        expect(f1.names).to.not.include('file15.md')

    })

    it('Ignores types if specified by "ignoreTypes"', () => {
        const f1 = finder()
        const f2 = finder({
            ignoreTypes: ['js']
        })
        const f3 = finder({
            ignoreTypes: ['txt', 'md']
        })

        expect(f1.names).to.include('file2.js')
        expect(f1.names).to.include('file1.txt')
        expect(f1.names).to.include('file4.md')

        expect(f2.names).to.not.include('file2.js')

        expect(f3.names).to.not.include('file4.md')
        expect(f3.names).to.not.include('file1.txt')
    })

    it('Finds types specified by onlyTypes', () => {
        const f1 = finder({
            onlyTypes: ['md']
        })

        const f2 = finder({
            onlyTypes: ['js', 'txt']
        })

        expect(f1.names).to.include('file15.md')
        expect(f1.names).to.include('file4.md')
        expect(f1.names).to.not.include('file1.txt')
        expect(f1.names).to.not.include('file2.js')
        
        expect(f2.names).to.include('file1.txt')
        expect(f2.names).to.include('file2.js')
        expect(f2.names).to.not.include('file4.md')
        expect(f2.names).to.not.include('file15.md')
    })

    it('Ignored types overrides "onlyTypes', () => {
        const f1 = finder({
            onlyTypes: ['md', 'txt'],
            ignoreTypes: ['txt']
        })

        expect(f1.names).to.include('file4.md')
        expect(f1.names).to.not.include('file1.txt')
    })

    it('Only recurses to specified depth by "maxDepth"', () => {
        const f1 = finder()
        const f2 = finder({
            maxDepth: 2,
        })

        // console.log(f2.names)
        // console.log(f2.files)
        // console.log(f2.dirMap)

        expect(f1.names).to.include('file1.txt')
        expect(f1.names).to.include('file15.md')
        
        expect(f2.names).to.include('file1.txt')
        expect(f2.names).to.include('file5.js')
        expect(f2.names).to.not.include('file15.md')
    })




})


describe('finder | advanced config', () => {

    // it.skip('path: finds files within the provided paths')
    // it.skip('ignorePaths: ignores files within the provided paths')
    // it.skip('ignoreTypes: ignores provided types')
    // it.skip('onlyTypes: returns only files matching provided types')
    // it.skip('onlyTypes: if ignoreTypes has same value as onlyTypes - choose correctly')
    // it.skip('maxDepth: stops recursion at the provided depth')
    
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