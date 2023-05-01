const {
    finder,
    expect,
    mockFs,
    returnTest,
    createMockFileWithDate,
    createOffsetDate,
} = require('../base.js')


describe('PATHS', () => {
    beforeEach(() => {
        mockFs({
            'symlink_to_file1': mockFs.symlink({
                path: '/dir1/file1.txt',
            }),
            'symlink_to_file9': mockFs.symlink({
                path: '/dir3/subdir2/subdir3/file9.js',
            }),
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
                    },
                }

            },
            dir5: {



                '1995_1_2.md': createMockFileWithDate(new Date('1995/1/2')),
                '2010_11_12.md': createMockFileWithDate(new Date('2010/11/12')),
                '2020_1_2.md': createMockFileWithDate(new Date('2020-01-02')),
                '2000_2_29.md': createMockFileWithDate(new Date(2000, 1, 29)),
                '1999_12_31.md': createMockFileWithDate(new Date(1999, 11, 31)),
                '1970_1_1.md': createMockFileWithDate(new Date(0)),
                '2023_4_30.md': createMockFileWithDate(new Date(1677763200000)), // Unix timestamp for 2023-04-30
                '2005_6_15.md': createMockFileWithDate(new Date('2005-06-15T00:00:00Z')),
                '2015_10_21.md': createMockFileWithDate(new Date('October 21, 2015')),
                '1975_4_1.md': createMockFileWithDate(new Date('1975-04-01T00:00:00Z')),

                '2020_7_4.md': createMockFileWithDate(new Date('July 4, 2020')),
                '2001_9_11.md': createMockFileWithDate(new Date('2001-09-11T00:00:00Z')),
                '2023_3_13.md': createMockFileWithDate(new Date(1676131200000)), // Unix timestamp for 2023-03-13
                '1979_7_12.md': createMockFileWithDate(new Date('1979-07-12T00:00:00Z')),
                '1993_3_21.md': createMockFileWithDate(new Date('March 21, 1993')),
                '1985_5_16.md': createMockFileWithDate(new Date(1985, 4, 16)), // Note: months are 0-based
                '1991_11_9.md': createMockFileWithDate(new Date(1991, 10, 9)), // Note: months are 0-based
                '2011_2_18.md': createMockFileWithDate(new Date(1297987200000)), // Unix timestamp for 2011-02-18
                '2002_8_24.md': createMockFileWithDate(new Date('2002-08-24T00:00:00Z')),
                '2009_12_31.md': createMockFileWithDate(new Date('2009-12-31T00:00:00Z')),
                '2022_6_30.md': createMockFileWithDate(new Date('2022-06-30T00:00:00Z')),
                '1980_1_1.md': createMockFileWithDate(new Date('1980-01-01T00:00:00Z')),
                '2003_2_2.md': createMockFileWithDate(new Date('2003-02-02T00:00:00Z')),
                '2004_3_3.md': createMockFileWithDate(new Date('2004-03-03T00:00:00Z')),
                '2005_4_4.md': createMockFileWithDate(new Date('2005-04-04T00:00:00Z')),
                '2006_5_5.md': createMockFileWithDate(new Date('2006-05-05T00:00:00Z')),
                '2007_6_6.md': createMockFileWithDate(new Date('2007-06-06T00:00:00Z')),
                '2008_7_7.md': createMockFileWithDate(new Date('2008-07-07T00:00:00Z')),
                '2009_8_8.md': createMockFileWithDate(new Date('2009-08-08T00:00:00Z')),
                '2010_9_9.md': createMockFileWithDate(new Date('2010-09-09T00:00:00Z')),
                '2011_10_10.md': createMockFileWithDate(new Date('2011-10-10T00:00:00Z')),
                '2012_11_11.md': createMockFileWithDate(new Date('2012-11-11T00:00:00Z')),
                '2013_12_12.md': createMockFileWithDate(new Date('2013-12-12T00:00:00Z')),
                '2014_1_13.md': createMockFileWithDate(new Date('2014-01-13T00:00:00Z')),
                // ... 90 more date entries


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



})
