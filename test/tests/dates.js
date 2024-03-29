const { fstat } = require('fs');
const {
    finder,
    expect,
    mockFs,
    returnTest,
    createMockFileWithDate,
    createOffsetDate,
    counter
} = require('../base.js')
const fs = require('fs')

const ENABLE_MOCK_FS = true


describe('DATES', () => {
    beforeEach(() => {
        if(!ENABLE_MOCK_FS) return

        mockFs({

            standard: {
                '-1d.md': createMockFileWithDate(createOffsetDate('-1d'), false),
                '-12h.md': createMockFileWithDate(createOffsetDate('-12h'), false),
                '-1h.md': createMockFileWithDate(createOffsetDate('-1h'), false),
                '-10m.md': createMockFileWithDate(createOffsetDate('-10m'), false),
                '-7m.md': createMockFileWithDate(createOffsetDate('-7m'), false),
                
                '2000_2_29.md': createMockFileWithDate(new Date(2000, 1, 29), false),
                '2001_9_11.md': createMockFileWithDate(new Date('2001-09-11T00:00:00Z'), false),
                '2002_8_24.md': createMockFileWithDate(new Date('2002-08-24T00:00:00Z'), false),
                '2003_2_2.md': createMockFileWithDate(new Date('2003-02-02T00:00:00Z'), false),
                '2004_3_3.md': createMockFileWithDate(new Date('2004-03-03T00:00:00Z'), false),
                '2005_4_4.md': createMockFileWithDate(new Date('2005-04-04T00:00:00Z'), false),
                '2005_6_15.md': createMockFileWithDate(new Date('2005-06-15T00:00:00Z'), false),
    
    
    
                '1970_1_1.md': createMockFileWithDate(new Date(0), false),
                '1975_4_1.md': createMockFileWithDate(new Date('1975-04-01T00:00:00Z'), false),
                '1979_7_12.md': createMockFileWithDate(new Date('1979-07-12T00:00:00Z'), false),
                '1980_1_1.md': createMockFileWithDate(new Date('1980-01-01T00:00:00Z'), false),
                '1985_5_16.md': createMockFileWithDate(new Date(1985, 4, 16), false), // Note: months are 0-based
                '1991_11_9.md': createMockFileWithDate(new Date(1991, 10, 9), false), // Note: months are 0-based
                '1993_3_21.md': createMockFileWithDate(new Date('March 21, 1993'), false),
                '1995_1_2.md': createMockFileWithDate(new Date('1995/1/2'), false),
                '1999_12_31.md': createMockFileWithDate(new Date(1999, 11, 31), false),
    
                '2000_1_1_0.0.0.md': createMockFileWithDate(new Date(2000,1,1, 0, 0, 0), false),
                '2000_1_1_0.0.0.md': createMockFileWithDate(new Date(2000,1,1, 0, 0, 0), false),
                '2000_1_1_0.0.0.md': createMockFileWithDate(new Date(2000,1,1, 0, 0, 0), false),
    
                '2000_1_2.md': createMockFileWithDate(new Date(2000,1,2, 0, 0, 0), false),
                '2000_1_2.md': createMockFileWithDate(new Date(2000,1,2, 0, 0, 0), false),
                '2000_1_2.md': createMockFileWithDate(new Date(2000,1,2, 0, 0, 0), false),
    
    
                '2001_9_11.md': createMockFileWithDate(new Date('2001-09-11T00:00:00Z'), false),
                '2002_8_24.md': createMockFileWithDate(new Date('2002-08-24T00:00:00Z'), false),
                '2003_2_2.md': createMockFileWithDate(new Date('2003-02-02T00:00:00Z'), false),
                '2004_3_3.md': createMockFileWithDate(new Date('2004-03-03T00:00:00Z'), false),
                '2005_4_4.md': createMockFileWithDate(new Date('2005-04-04T00:00:00Z'), false),
                '2005_6_15.md': createMockFileWithDate(new Date('2005-06-15T00:00:00Z'), false),
                '2006_5_5.md': createMockFileWithDate(new Date('2006-05-05T00:00:00Z'), false),
                '2007_6_6.md': createMockFileWithDate(new Date('2007-06-06T00:00:00Z'), false),
                '2008_7_7.md': createMockFileWithDate(new Date('2008-07-07T00:00:00Z'), false),
                '2009_12_31.md': createMockFileWithDate(new Date('2009-12-31T00:00:00Z'), false),
                '2009_8_8.md': createMockFileWithDate(new Date('2009-08-08T00:00:00Z'), false),
                '2010_11_12.md': createMockFileWithDate(new Date('2010/11/12'), false),
                '2010_9_9.md': createMockFileWithDate(new Date('2010-09-09T00:00:00Z'), false),
                '2011_2_18.md': createMockFileWithDate(new Date(1297987200000), false), // Unix timestamp for 2011-02-18
                '2011_10_10.md': createMockFileWithDate(new Date('2011-10-10T00:00:00Z'), false),
                '2012_11_11.md': createMockFileWithDate(new Date('2012-11-11T00:00:00Z'), false),
                '2013_12_12.md': createMockFileWithDate(new Date('2013-12-12T00:00:00Z'), false),
                '2014_1_13.md': createMockFileWithDate(new Date('2014-01-13T00:00:00Z'), false),
                '2015_10_21.md': createMockFileWithDate(new Date('October 21, 2015'), false),
                '2020_1_2.md': createMockFileWithDate(new Date('2020-01-02'), false),
                '2020_7_4.md': createMockFileWithDate(new Date('July 4, 2020'), false),
                '2022_6_30.md': createMockFileWithDate(new Date('2022-06-30T00:00:00Z'), false),
                '2023_3_13.md': createMockFileWithDate(new Date(1676131200000), false), // Unix timestamp for 2023-03-13
                '2023_4_30.md': createMockFileWithDate(new Date(1677763200000), false), // Unix timestamp for 2023-04-30
                
            },

            symlinks: {

                '-1d.md': createMockFileWithDate(createOffsetDate('-1d'), true),
                '-12h.md': createMockFileWithDate(createOffsetDate('-12h'), true),
                '-1h.md': createMockFileWithDate(createOffsetDate('-1h'), true),
                '-10m.md': createMockFileWithDate(createOffsetDate('-10m'), true),
                '-7m.md': createMockFileWithDate(createOffsetDate('-7m'), true),
                
                '2000_2_29.md': createMockFileWithDate(new Date(2000, 1, 29), true),
                '2001_9_11.md': createMockFileWithDate(new Date('2001-09-11T00:00:00Z'), true),
                '2002_8_24.md': createMockFileWithDate(new Date('2002-08-24T00:00:00Z'), true),
                '2003_2_2.md': createMockFileWithDate(new Date('2003-02-02T00:00:00Z'), true),
                '2004_3_3.md': createMockFileWithDate(new Date('2004-03-03T00:00:00Z'), true),
                '2005_4_4.md': createMockFileWithDate(new Date('2005-04-04T00:00:00Z'), true),
                '2005_6_15.md': createMockFileWithDate(new Date('2005-06-15T00:00:00Z'), true),



                '1970_1_1.md': createMockFileWithDate(new Date(0), true),
                '1975_4_1.md': createMockFileWithDate(new Date('1975-04-01T00:00:00Z'), true),
                '1979_7_12.md': createMockFileWithDate(new Date('1979-07-12T00:00:00Z'), true),
                '1980_1_1.md': createMockFileWithDate(new Date('1980-01-01T00:00:00Z'), true),
                '1985_5_16.md': createMockFileWithDate(new Date(1985, 4, 16), true), // Note: months are 0-based
                '1991_11_9.md': createMockFileWithDate(new Date(1991, 10, 9), true), // Note: months are 0-based
                '1993_3_21.md': createMockFileWithDate(new Date('March 21, 1993'), true),
                '1995_1_2.md': createMockFileWithDate(new Date('1995/1/2'), true),
                '1999_12_31.md': createMockFileWithDate(new Date(1999, 11, 31), true),

                '2000_1_1_0.0.0.md': createMockFileWithDate(new Date(2000,1,1, 0, 0, 0), true),
                '2000_1_1_0.0.0.md': createMockFileWithDate(new Date(2000,1,1, 0, 0, 0), true),
                '2000_1_1_0.0.0.md': createMockFileWithDate(new Date(2000,1,1, 0, 0, 0), true),

                '2000_1_2.md': createMockFileWithDate(new Date(2000,1,2, 0, 0, 0), true),
                '2000_1_2.md': createMockFileWithDate(new Date(2000,1,2, 0, 0, 0), true),
                '2000_1_2.md': createMockFileWithDate(new Date(2000,1,2, 0, 0, 0), true),


                '2001_9_11.md': createMockFileWithDate(new Date('2001-09-11T00:00:00Z'), true),
                '2002_8_24.md': createMockFileWithDate(new Date('2002-08-24T00:00:00Z'), true),
                '2003_2_2.md': createMockFileWithDate(new Date('2003-02-02T00:00:00Z'), true),
                '2004_3_3.md': createMockFileWithDate(new Date('2004-03-03T00:00:00Z'), true),
                '2005_4_4.md': createMockFileWithDate(new Date('2005-04-04T00:00:00Z'), true),
                '2005_6_15.md': createMockFileWithDate(new Date('2005-06-15T00:00:00Z'), true),
                '2006_5_5.md': createMockFileWithDate(new Date('2006-05-05T00:00:00Z'), true),
                '2007_6_6.md': createMockFileWithDate(new Date('2007-06-06T00:00:00Z'), true),
                '2008_7_7.md': createMockFileWithDate(new Date('2008-07-07T00:00:00Z'), true),
                '2009_12_31.md': createMockFileWithDate(new Date('2009-12-31T00:00:00Z'), true),
                '2009_8_8.md': createMockFileWithDate(new Date('2009-08-08T00:00:00Z'), true),
                '2010_11_12.md': createMockFileWithDate(new Date('2010/11/12'), true),
                '2010_9_9.md': createMockFileWithDate(new Date('2010-09-09T00:00:00Z'), true),
                '2011_2_18.md': createMockFileWithDate(new Date(1297987200000), true), // Unix timestamp for 2011-02-18
                '2011_10_10.md': createMockFileWithDate(new Date('2011-10-10T00:00:00Z'), true),
                '2012_11_11.md': createMockFileWithDate(new Date('2012-11-11T00:00:00Z'), true),
                '2013_12_12.md': createMockFileWithDate(new Date('2013-12-12T00:00:00Z'), true),
                '2014_1_13.md': createMockFileWithDate(new Date('2014-01-13T00:00:00Z'), true),
                '2015_10_21.md': createMockFileWithDate(new Date('October 21, 2015'), true),
                '2020_1_2.md': createMockFileWithDate(new Date('2020-01-02'), true),
                '2020_7_4.md': createMockFileWithDate(new Date('July 4, 2020'), true),
                '2022_6_30.md': createMockFileWithDate(new Date('2022-06-30T00:00:00Z'), true),
                '2023_3_13.md': createMockFileWithDate(new Date(1676131200000), true), // Unix timestamp for 2023-03-13
                '2023_4_30.md': createMockFileWithDate(new Date(1677763200000), true), // Unix timestamp for 2023-04-30
            }
        });
    });

    afterEach(mockFs.restore);

    const getYears = (data) => data.files.map(x => x.name.split(/_|\./)[0])

    const { inc, reset } = counter


    it('A. Returns files in the correct date range - createdBefore: ("2010"))', () => {
        const f1 = finder({ 
            paths: ['./standard'],
            createdBefore: '2010',
        })
        const f2 = finder({ 
            paths: ['./symlinks'],
            createdBefore: '2010' 
        })

        const y1 = getYears(f1)
        const y2 = getYears(f2)

        expect(f1.files.length).to.eq(23)
        expect(f2.files.length).to.eq(23)

        expect(y1).to.include('2009')
        expect(y2).to.include('2008')
        
        expect(y1).to.not.include('2010')
        expect(y2).to.not.include('2010')
        expect(y1).to.not.include('-10m')
        expect(y2).to.not.include('-10m')
    })

    it('B. Returns files in the correct date range - createdBefore: (946684800000)', () => {
        const f1 = finder({
            paths: ['./standard'],
            createdBefore: 946684800000,
        })
        const f2 = finder({
            paths: ['./symlinks'],
            createdBefore: 946684800000
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(f1.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(9)
        expect(f2.files.length).to.eq(9)
        expect(y1).to.include('1999')
        expect(y2).to.include('1999')
        expect(y1).to.not.include('2020')
        expect(y2).to.not.include('2020')
    })

    it('H. Returns files in the correct date range - createdAfter: (-720000)', () => {
        const f1 = finder({
            paths: ['./standard'],
            createdAfter: -720000,
        })
        const f2 = finder({
            paths: ['./symlinks'],
            createdAfter: -720000
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(f1.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(2)
        expect(f2.files.length).to.eq(2)
        expect(y1).to.include('-10m')
        expect(y2).to.include('-7m')
        expect(y1).to.not.include('-1h')
        expect(y2).to.not.include('-1d')
    })

    it('C. Returns files in the correct date range - createdAfter: ("-720")', () => {
        const f1 = finder({
            createdAfter: '-12m',
            paths: ['./standard'],
        })
        const f2 = finder({
            createdAfter: '-12m',
            paths: ['./symlinks'],
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(f1.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(2)
        expect(f2.files.length).to.eq(2)
        expect(y1).to.include('-10m')
        expect(y2).to.include('-7m')
        expect(y1).to.not.include('-1h')
        expect(y2).to.not.include('-1d')
    })


    it('D. Returns files in the correct date range - createdAfter: ("-12m")', () => {
        const f1 = finder({
            createdAfter: '-12m',
            paths: ['./standard'],
        })
        const f2 = finder({
            createdAfter: '-12m',
            paths: ['./symlinks'],
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(f1.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(2)
        expect(f2.files.length).to.eq(2)
        expect(y1).to.include('-10m')
        expect(y2).to.include('-7m')
        expect(y1).to.not.include('-1h')
        expect(y2).to.not.include('-1d')
    })

    it('E. Returns files in the correct date range - createdAfter: ("-16h")', () => {
        const f1 = finder({
            createdAfter: '-16h',
            paths: ['./standard'],
        })
        const f2 = finder({
            createdAfter: '-16h',
            paths: ['./symlinks'],
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(f1.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(4)
        expect(f2.files.length).to.eq(4)
        expect(y1).to.include('-10m')
        expect(y2).to.include('-7m')
        expect(y1).to.include('-1h')
        expect(y1).to.include('-12h')
        expect(y2).to.not.include('-1d')
    })

    it('F. Returns files in the correct date range - createdAfter: ("-2d")', () => {
        const f1 = finder({
            createdAfter: '-2d',
            paths: ['./standard'],
        })
        const f2 = finder({
            createdAfter: '-2d',
            paths: ['./symlinks'],
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(f1.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(5)
        expect(f2.files.length).to.eq(5)
        expect(y1).to.include('-10m')
        expect(y2).to.include('-7m')
        expect(y1).to.include('-1h')
        expect(y1).to.include('-12h')
        expect(y2).to.include('-1d')
    })






    it('I. Returns files in the correct date range (createdAfter: "2000")', () => {
        const f1 = finder({
            paths: ['./standard'],
            createdAfter: '2000',
        })
        const f2 = finder({
            paths: ['./symlinks'],
            createdAfter: '2000'
        })
        const y1 = getYears(f1)
        const y2 = getYears(f2)
        // console.log(data.files.map(x => `${x.name}: \n${x.created}`))
        expect(f1.files.length).to.eq(32)
        expect(f2.files.length).to.eq(32)
        expect(y1).to.include('2000')
        expect(y2).to.include('2000')
        expect(y1).to.not.include('1999')
        expect(y2).to.not.include('1999')
    })


    



})
