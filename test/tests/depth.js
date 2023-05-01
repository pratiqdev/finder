const {
    finder,
    expect,
    mockFs,
    returnTest,
    createMockFileWithDate,
    createOffsetDate,
} = require('../base.js')


describe.skip('DEPTH', () => {
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



            }
        });
    });

    afterEach(mockFs.restore);


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
