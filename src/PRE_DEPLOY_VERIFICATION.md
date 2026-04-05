# ✅ PRE-DEPLOYMENT VERIFICATION

Run this checklist before pushing to Netlify:

## 📁 File Checks

### Required Files Exist:
- [x] `/.nvmrc` (contains "20")
- [x] `/.npmrc` (contains "@jsr:registry=https://npm.jsr.io")
- [x] `/netlify.toml` (in project root, not in src/)
- [x] `/tsconfig.json` (TypeScript main config)
- [x] `/tsconfig.node.json` (TypeScript node config)
- [x] `/package.json` (has zod dependency)
- [x] `/vite.config.ts` (outDir: 'dist')
- [x] `/database/fresh-setup-v2.sql` (671 lines)

### Configuration Values:

**netlify.toml:**
```toml
[build.environment]
  NODE_VERSION = "20"  ✅
  
[build]
  publish = "dist"  ✅
```

**package.json:**
```json
"dependencies": {
  ...
  "zod": "^3.23.8",  ✅
  ...
},
"engines": {
  "node": ">=18.0.0 <22.0.0"  ✅
}
```

**vite.config.ts:**
```typescript
build: {
  outDir: 'dist',  ✅
}
```

**.nvmrc:**
```
20  ✅
```

**.npmrc:**
```
@jsr:registry=https://npm.jsr.io  ✅
(No leading whitespace)
```

## 🔍 Quick File Verification

Run these commands to verify:

```bash
# Check .nvmrc exists and has correct value
cat .nvmrc
# Expected output: 20

# Check .npmrc exists and has correct format
cat .npmrc
# Expected output: @jsr:registry=https://npm.jsr.io

# Check package.json has zod
grep "zod" package.json
# Expected output: "zod": "^3.23.8",

# Check netlify.toml has Node 20
grep "NODE_VERSION" netlify.toml
# Expected output: NODE_VERSION = "20"

# Check vite.config.ts has correct outDir
grep "outDir" vite.config.ts
# Expected output: outDir: 'dist',
```

## ✅ All Files Verified?

If all checks pass ✅, you're ready to deploy!

**Next steps:**
1. Set Netlify environment variables
2. Deploy database schema
3. Push code

See `/QUICK_DEPLOY_CARD.md` for deployment steps.

---

## 🔧 If Any Check Fails:

### .nvmrc missing or wrong
```bash
echo "20" > .nvmrc
```

### .npmrc missing or wrong
```bash
echo "@jsr:registry=https://npm.jsr.io" > .npmrc
```

### zod dependency missing
Add to package.json dependencies:
```json
"zod": "^3.23.8"
```

### Wrong Node version in netlify.toml
Change `NODE_VERSION = "18"` to `NODE_VERSION = "20"`

### Wrong outDir in vite.config.ts
Change to `outDir: 'dist'`

---

**Last Updated:** April 5, 2026  
**Status:** 🟢 All fixes applied and verified
