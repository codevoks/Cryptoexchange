# Quick Package Checklist - Turborepo

## 🚀 Add New Package (5 minutes)

### Step 1: Create Package Structure
```bash
mkdir -p packages/my-package/src
cd packages/my-package
```

### Step 2: Create `package.json`
```json
{
  "name": "@repo/my-package",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {
    ".": "./dist/index.js"    // OR "./src/*.ts" for source files
  },
  "dependencies": {
    // Add deps here
  }
}
```

**⚠️ CRITICAL:** Package name MUST be `@repo/package-name`

### Step 3: Create Source File
```bash
# Create src/index.ts with your code
```

### Step 4: Build (if using dist/)
```bash
npx tsc  # Creates dist/index.js and dist/index.d.ts
```

### Step 5: Add to App
Edit `apps/web/package.json` (or whichever app):
```json
{
  "dependencies": {
    "@repo/my-package": "*"  // ⚠️ Use "*" not version number
  }
}
```

### Step 6: Install
```bash
cd ../..  # Go to root
npm install  # ⚠️ ALWAYS run from root
```

### Step 7: Use It
```typescript
import { something } from "@repo/my-package";
```

---

## ✅ Verification Checklist

- [ ] Package name starts with `@repo/`
- [ ] Added to app's `package.json` with `"*"`
- [ ] Ran `npm install` at root
- [ ] If using `dist/`, files exist in `dist/` folder
- [ ] Import works in your code

---

## 🔥 Common Mistakes

❌ **Wrong:** `"name": "my-package"`  
✅ **Right:** `"name": "@repo/my-package"`

❌ **Wrong:** `"@repo/my-package": "^1.0.0"`  
✅ **Right:** `"@repo/my-package": "*"`

❌ **Wrong:** Running `npm install` in package directory  
✅ **Right:** Run `npm install` at monorepo root

❌ **Wrong:** Using `dist/` but not building  
✅ **Right:** Run `npx tsc` or add build script

---

## 📦 Two Patterns

### Pattern A: Compiled (dist/)
```json
"exports": { ".": "./dist/index.js" }
```
- Need to run `npx tsc` to build
- Good for production packages

### Pattern B: Source (src/)
```json
"exports": { "./*": "./src/*.ts" },
"types": "./index.ts"
```
- No build needed
- Good for development

---

## 🆘 Still Not Working?

1. **Check package name** - Must be exact match
2. **Check exports path** - Must match actual file location
3. **Reinstall** - Delete `node_modules`, run `npm install` at root
4. **Check dist/** - If using dist/, ensure files exist
5. **Check types** - If TS errors, ensure `.d.ts` file exists

---

**Time saved: ~30 minutes per package! 🎉**

