const {
    finder,
    expect,
    mockFs,
} = require('../base.js')
const fs = require('fs')
const path = require('path')

describe.only('Reader', () => {

    it('Uses the reader function if provided', () => {
        mockFs.bypass(() => {
        const fileData = finder({
            paths: ['./misc/DIR_B', './misc/SYMLINKS'],
            reader: (file) => {
                    try{

                        console.log(`Reading path: ${file.path} @ ${file.sym}`)
                        // let data = fs.readFileSync(file.sym, 'utf8');
                        // console.log(`Reading data: ${data}`)


                    }catch(err){
                        console.log(err)
                    }
                }
            })
        })
    })

})


// /home/shlep/Documents/code/finder/misc/SYMLINKS/md_B_2_symlink.md
// /home/shlep/Documents/code/finder/misc/SYMLINKS/md_B_2_symlink.md