// export default {
//   entryPoints: ['./src/main.ts'],
//   format: ['cjs'],
//   outDir: './dist',
//   dts: true,
//   dtsBundle: true,
//   dtsBundleOutFile: 'types.d.ts',
//   sourcemap: false,
//   minify: false,
//   clean: true,
//   legacyOutput: true
// }

import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    // minify: !options.watch,
    entryPoints: ['./src/main.ts'],
    format: ['cjs', 'esm'],
    outDir: './dist',
    dts: true,
    dtsBundle: true,
    dtsBundleOutFile: 'types.d.ts',
    sourcemap: false,
    minify: false,
    clean: true,
    legacyOutput: false
  }
})
