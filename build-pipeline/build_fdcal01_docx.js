// Current scaffold wrapper. Replace VERIFY placeholders only from a verified evidence manifest.
const { buildModuleDocx } = require('./build_module_docx');
module.exports = { build: (outputPath) => buildModuleDocx('fdcal01', outputPath) };
if (require.main === module) module.exports.build(process.argv[2]);
