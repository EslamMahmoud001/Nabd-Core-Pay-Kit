const path = require('path');
const { buildDeck } = require('./build_slides');
const { moduleModel } = require('./build_module_model');

async function buildModuleSlides(key, outputPath) {
  const model = moduleModel(key);
  const out = path.resolve(outputPath || `${model.meta.bpId.replaceAll('/', '-')}_${model.meta.title.replaceAll(/[^A-Za-z0-9]+/g, '_')}_DRAFT.pptx`);
  await buildDeck(model, out);
  return out;
}

module.exports = { buildModuleSlides };
if (require.main === module) buildModuleSlides(process.argv[2], process.argv[3]);

