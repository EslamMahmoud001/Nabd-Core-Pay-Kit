#!/usr/bin/env bash
# Tier 0 — static validation of the nabd-core-pay-kit plugin. Deterministic, no agent, non-destructive.
# Run from the plugin root:  bash qa/tier0_static_check.sh
set -u
cd "$(dirname "$0")/.." || exit 2
PASS=0; FAIL=0
ok(){ echo "  PASS  $1"; PASS=$((PASS+1)); }
no(){ echo "  FAIL  $1"; FAIL=$((FAIL+1)); }

echo "== manifests =="
python -c "import json;json.load(open('.claude-plugin/plugin.json'))" 2>/dev/null && ok "plugin.json is valid JSON" || no "plugin.json invalid"
python -c "import json;json.load(open('.claude-plugin/marketplace.json'))" 2>/dev/null && ok "marketplace.json is valid JSON" || no "marketplace.json invalid"
pn=$(python -c "import json;print(json.load(open('.claude-plugin/plugin.json'))['name'])" 2>/dev/null)
mn=$(python -c "import json;print(json.load(open('.claude-plugin/marketplace.json'))['name'])" 2>/dev/null)
mp=$(python -c "import json;print(json.load(open('.claude-plugin/marketplace.json'))['plugins'][0]['name'])" 2>/dev/null)
[ "$pn" = "nabd-core-pay-kit" ] && ok "plugin name = $pn" || no "plugin name unexpected: $pn"
[ "$mp" = "$pn" ] && ok "marketplace plugin name matches" || no "marketplace plugin name mismatch: $mp vs $pn"
[ -n "$mn" ] && ok "marketplace name = $mn" || no "marketplace name missing"

echo "== install docs match manifest names =="
grep -q "install $pn@$mn" README.md && ok "README install command matches names" || no "README install command mismatch"
grep -q "install $pn@$mn" INSTALL.md && ok "INSTALL install command matches names" || no "INSTALL install command mismatch"

echo "== skills =="
sc=0
for s in skills/*/SKILL.md; do
  sc=$((sc+1))
  n=$(awk -F': *' '/^name:/{print $2; exit}' "$s")
  d=$(grep -c '^description:' "$s")
  [ -n "$n" ] && [ "$d" -ge 1 ] && ok "skill frontmatter ok: $n" || no "skill frontmatter incomplete: $s"
done
[ "$sc" -ge 5 ] && ok "found $sc skills" || no "expected >=5 skills, found $sc"
dups=$(awk -F': *' '/^name:/{print $2}' skills/*/SKILL.md | sort | uniq -d)
[ -z "$dups" ] && ok "skill names unique" || no "duplicate skill names: $dups"

echo "== commands =="
cc=$(ls commands/*.md 2>/dev/null | wc -l)
[ "$cc" -ge 5 ] && ok "found $cc commands" || no "expected >=5 commands, found $cc"
for c in commands/*.md; do grep -q '^description:' "$c" && ok "command has description: $(basename "$c")" || no "command missing description: $c"; done

echo "== no dangling internal references =="
grep -rIl "Nabd-Ops-Kit\|KB-03\|soffice\|pdftoppm" skills commands knowledge-base reference templates README.md INSTALL.md 2>/dev/null | grep . \
  && no "found stale refs (Nabd-Ops-Kit / KB-03 / soffice / pdftoppm)" \
  || ok "no stale Nabd-Ops-Kit / KB-03 / PDF refs"
for f in reference/BUSINESS_PROCESSES.md reference/FEATURE_INVENTORY.md reference/SEEDED_DATA.md reference/PREREQUISITES.md reference/ASSUMPTIONS.md \
         knowledge-base/KB-01_Nabd_System_Guide.md knowledge-base/KB-02_KUT_UAT_Methodology.md knowledge-base/KB-04_Lessons_and_Playbook.md \
         knowledge-base/KB-05_Environment_Runtime_and_Data.md knowledge-base/KB-06_Agent_Orchestration_and_Delegation.md \
         templates/ANOMALY_REGISTER_TEMPLATE.md templates/COVERAGE_AUDIT_TEMPLATE.md templates/capture_TEMPLATE.mjs; do
  [ -f "$f" ] && ok "exists: $f" || no "missing referenced file: $f"
done

echo "== build pipeline syntax =="
bc=0; bad=0
for j in build-pipeline/*.js; do bc=$((bc+1)); node --check "$j" 2>/dev/null || { no "syntax error: $j"; bad=1; }; done
[ "$bad" = 0 ] && ok "all $bc pipeline .js pass node --check" || true
python -c "import json;json.load(open('build-pipeline/package.json'))" 2>/dev/null && ok "build-pipeline/package.json valid" || no "build package.json invalid"
[ -f build-pipeline/assets/raptors_icon.png ] && ok "brand asset present" || no "brand asset missing"

echo "== git hygiene =="
if git rev-parse --git-dir >/dev/null 2>&1; then
  stray=$(git ls-files | grep -E "node_modules|screenshots/|\.docx$|\.pptx$" | head)
  [ -z "$stray" ] && ok "no stray tracked files" || no "stray tracked files: $stray"
else
  echo "  (skip git hygiene — not a git repo)"
fi

echo
echo "== Tier 0 result:  $PASS passed, $FAIL failed =="
[ "$FAIL" -eq 0 ] && { echo "TIER 0: GREEN"; exit 0; } || { echo "TIER 0: RED"; exit 1; }
