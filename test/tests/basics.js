const {
    finder,
    expect,
    mockFs,
    returnTest,
    createMockFileWithDate,
    createOffsetDate,
} = require('../base.js')

describe.skip('Basics', () => {

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
