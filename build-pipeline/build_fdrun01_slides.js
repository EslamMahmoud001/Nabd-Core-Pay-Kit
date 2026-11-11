// Current scaffold wrapper. Replace VERIFY placeholders only from a verified evidence manifest.
const { buildModuleSlides } = require('./build_module_slides');
module.exports = { build: (outputPath) => buildModuleSlides('fdrun01', outputPath) };
if (require.main === module) module.exports.build(process.argv[2]);
