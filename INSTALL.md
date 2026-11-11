# Install the Nabd Core + Pay Kit

Marketplace name: `nabd-kit` · plugin name: `nabd-pay-kit`

## GitHub marketplace

```text
/plugin marketplace add EslamMahmoud001/Nabd-Core-Pay-Kit
/plugin install nabd-pay-kit@nabd-kit
```

Reload Claude Code and confirm the five `/nabd-*` commands appear.

## Local clone

```text
git clone https://github.com/EslamMahmoud001/Nabd-Core-Pay-Kit.git
/plugin marketplace add <absolute-path-to-Nabd-Core-Pay-Kit>
/plugin install nabd-pay-kit@nabd-kit
```

## Update

```text
/plugin marketplace update nabd-kit
/plugin update nabd-pay-kit
```

For a local plugin clone, update it through your approved Git workflow, refresh/reinstall the marketplace entry as required by your Claude Code version, then reload. The Nabd application clone remains separate and read-only for kit workflows.

## One-time dependencies

Meet `reference/PREREQUISITES.md`, then install the document build dependencies:

```text
cd build-pipeline
npm install
```

The application clone has its own install/start instructions and gitignored `default-env.json`. Obtain external configuration through the approved secret channel; never copy it into this plugin.

Run the cross-platform static gate from the plugin root:

```text
node qa/tier0_static_check.mjs
```

Word and PowerPoint viewers are needed for final visual QA. PowerPoint desktop is optional unless using the legacy Windows combine helper. PDF tooling is not required.
