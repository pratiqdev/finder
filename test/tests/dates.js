const { fstat } = require('fs');
const {
    finder,
    expect,
    mockFs,
    returnTest,
    createMockFileWithDate,
    createOffsetDate,
} = require('../base.js')
const fs = require('fs')


describe('DATES', () => {
    beforeEach(() => {
        mockFs({
            
            '1970_1_1.md': createMockFileWithDate(new Date(0)),
            '1975_4_1.md': createMockFileWithDate(new Date('1975-04-01T00:00:00Z')),
            '1979_7_12.md': createMockFileWithDate(new Date('1979-07-12T00:00:00Z')),
            '1980_1_1.md': createMockFileWithDate(new Date('1980-01-01T00:00:00Z')),
            '1985_5_16.md': createMockFileWithDate(new Date(1985, 4, 16)), // Note: months are 0-based
            '1991_11_9.md': createMockFileWithDate(new Date(1991, 10, 9)), // Note: months are 0-based
            '1993_3_21.md': createMockFileWithDate(new Date('March 21, 1993')),
            '1995_1_2.md': createMockFileWithDate(new Date('1995/1/2')),
            '1999_12_31.md': createMockFileWithDate(new Date(1999, 11, 31)),
            
            '2000_2_29.md': createMockFileWithDate(new Date(2000, 1, 29)),
            '2001_9_11.md': createMockFileWithDate(new Date('2001-09-11T00:00:00Z')),
            '2002_8_24.md': createMockFileWithDate(new Date('2002-08-24T00:00:00Z')),
            '2003_2_2.md': createMockFileWithDate(new Date('2003-02-02T00:00:00Z')),
            '2004_3_3.md': createMockFileWithDate(new Date('2004-03-03T00:00:00Z')),
            '2005_4_4.md': createMockFileWithDate(new Date('2005-04-04T00:00:00Z')),
            '2005_6_15.md': createMockFileWithDate(new Date('2005-06-15T00:00:00Z')),
            '2006_5_5.md': createMockFileWithDate(new Date('2006-05-05T00:00:00Z')),
            '2007_6_6.md': createMockFileWithDate(new Date('2007-06-06T00:00:00Z')),
            '2008_7_7.md': createMockFileWithDate(new Date('2008-07-07T00:00:00Z')),
            '2009_12_31.md': createMockFileWithDate(new Date('2009-12-31T00:00:00Z')),
            '2009_8_8.md': createMockFileWithDate(new Date('2009-08-08T00:00:00Z')),
            '2010_11_12.md': createMockFileWithDate(new Date('2010/11/12')),
            '2010_9_9.md': createMockFileWithDate(new Date('2010-09-09T00:00:00Z')),
            '2011_2_18.md': createMockFileWithDate(new Date(1297987200000)), // Unix timestamp for 2011-02-18
            '2011_10_10.md': createMockFileWithDate(new Date('2011-10-10T00:00:00Z')),
            '2012_11_11.md': createMockFileWithDate(new Date('2012-11-11T00:00:00Z')),
            '2013_12_12.md': createMockFileWithDate(new Date('2013-12-12T00:00:00Z')),
            '2014_1_13.md': createMockFileWithDate(new Date('2014-01-13T00:00:00Z')),
            '2015_10_21.md': createMockFileWithDate(new Date('October 21, 2015')),
            '2020_1_2.md': createMockFileWithDate(new Date('2020-01-02')),
            '2020_7_4.md': createMockFileWithDate(new Date('July 4, 2020')),
            '2022_6_30.md': createMockFileWithDate(new Date('2022-06-30T00:00:00Z')),
            '2023_3_13.md': createMockFileWithDate(new Date(1676131200000)), // Unix timestamp for 2023-03-13
            '2023_4_30.md': createMockFileWithDate(new Date(1677763200000)), // Unix timestamp for 2023-04-30
         

            //+ symlinks
            '1970_1_1_symlink.md': mockFs.symlink({ path: '1970_1_1.md' }),
            '1975_4_1_symlink.md': mockFs.symlink({ path: '1975_4_1.md' }),
            '1979_7_12_symlink.md': mockFs.symlink({ path: '1979_7_12.md' }),
            '1980_1_1_symlink.md': mockFs.symlink({ path: '1980_1_1.md' }),
            '1985_5_16_symlink.md': mockFs.symlink({ path: '1985_5_16.md' }),
            '1991_11_9_symlink.md': mockFs.symlink({ path: '1991_11_9.md' }),
            '1993_3_21_symlink.md': mockFs.symlink({ path: '1993_3_21.md' }),
            '1995_1_2_symlink.md': mockFs.symlink({ path: '1995_1_2.md' }),
            '1999_12_31_symlink.md': mockFs.symlink({ path: '1999_12_31.md' }),
            

        });
    });

    afterEach(mockFs.restore);

    const getYears = (data) => data.files.map(x => x.name.split('_')[0])


    it('Returns files in the correct date range (createdBefore: "2020")', () => {
        const data = finder({ createdBefore: '2000' })
        const years = getYears(data)
        console.log(data.files.map(x => `${x.name}: \n${x.created}`))
        expect(data.files.length).to.eq(9)
        expect(years).to.include('1999')
        expect(years).to.not.include('2020')
    })




})
