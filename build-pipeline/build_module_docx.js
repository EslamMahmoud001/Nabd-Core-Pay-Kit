const path = require('path');
const { buildDoc, writeDoc } = require('./kutlib');
const { renderKut } = require('./render');
const { moduleModel } = require('./build_module_model');

async function buildModuleDocx(key, outputPath) {
  const model = moduleModel(key);
  const out = path.resolve(outputPath || `${model.meta.bpId.replaceAll('/', '-')}_${model.meta.title.replaceAll(/[^A-Za-z0-9]+/g, '_')}_DRAFT.docx`);
  await writeDoc(buildDoc(model.meta, renderKut(model)), out);
  return out;
}

module.exports = { buildModuleDocx };
if (require.main === module) buildModuleDocx(process.argv[2], process.argv[3]);

