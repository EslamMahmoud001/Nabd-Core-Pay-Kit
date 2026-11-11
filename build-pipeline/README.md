# Nabd KUT build pipeline

Local Node pipeline for branded Word + Slides Core + Pay training artifacts.

## Setup and validation

```text
npm install
npm run check
npm run example
```

Shared libraries are `kutlib.js` (Word), `build_slides.js` (Slides), and `render.js`. `build_template.js` and `build_example.js` are clean starting points. The `build_<id>_docx.js` / `build_<id>_slides.js` files are thin current wrappers around `module_catalogue.js` and `build_module_model.js`; they intentionally produce `VERIFY` placeholders until a verified evidence manifest replaces them.

## New module

1. Create a verified fact/screenshot manifest under the project working area.
2. Use the target module wrapper or copy `build_template.js`; replace every `VERIFY` placeholder from evidence.
3. Resolve screenshots and outputs relative to `__dirname` or accept explicit CLI paths. Never add a machine-specific absolute path.
4. Build both `.docx` and `.pptx`.
5. Open/render and visually inspect both, then apply KB-02's release checklist.

Example naming:

```text
node build_<id>_docx.js
node build_<id>_slides.js
```

The optional overview/chrome builders accept an output path:

```text
node build_master_overview.js output/overview.pptx
node build_chrome.js output/chrome.pptx
```

Do not infer success from file size alone. Screenshots, generated artifacts, credentials and tenant data remain untracked. Word + Slides are the shipped formats; PDF is not part of this pipeline.

## Dependency advisory

As of the 2026-08-13 validation, npm reports a high-severity denial-of-service advisory in the transitive `image-size` package used by `pptxgenjs` for malformed ICNS/JXL/HEIF images. The pipeline only accepts PNG/JPEG screenshots and `build_slides.js` checks both extension and file signature before handing an image to `pptxgenjs`. Keep screenshot inputs trusted and locally captured; rerun `npm audit` during upgrades and remove this mitigation note only when the upstream dependency is fixed and the build is revalidated. Do not use `npm audit fix --force`, which currently proposes a breaking major downgrade.
