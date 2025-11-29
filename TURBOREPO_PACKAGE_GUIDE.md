# How to Add a New Package in Turborepo

## Quick Checklist
- [ ] Create package directory structure
- [ ] Create `package.json` with correct name (`@repo/package-name`)
- [ ] Set up TypeScript config (if using TS)
- [ ] Create source files
- [ ] Add package to consuming apps' `package.json`
- [ ] Run `npm install` at root
- [ ] Test the build

---

## Step-by-Step Guide

### 1. Create Package Directory Structure

```bash
mkdir -p packages/your-package-name/src
cd packages/your-package-name
```

### 2. Create `package.json`

**Choose ONE pattern based on your needs:**

#### Pattern A: Using `dist/` folder (for compiled packages)
```json
{
  "name": "@repo/your-package-name",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./*": "./dist/*.js"
  },
  "dependencies": {
    // Add external dependencies here (e.g., "prom-client": "^15.1.3")
  }
}
```

#### Pattern B: Using `src/` directly (for TypeScript source files)
```json
{
  "name": "@repo/your-package-name",
  "version": "1.0.0",
  "main": "index.js",
  "types": "./index.ts",
  "exports": {
    "./*": "./src/*.ts"
  },
  "dependencies": {
    // Add external dependencies here
  }
}
```

**Key Points:**
- Package name MUST start with `@repo/`
- Use `"type": "module"` for ES modules
- For Pattern A: exports point to `./dist/`
- For Pattern B: exports point to `./src/` and include `types` field

### 3. Create TypeScript Config (if using TypeScript)

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "dist",
    "declaration": true,
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create Source Files

Create your source file (e.g., `src/index.ts`):

```typescript
// Your code here
export const myFunction = () => {
  // ...
};
```

### 5. Build the Package (if using Pattern A)

If you're using `dist/` folder, you need to compile:

```bash
# From package directory
npx tsc

# Or add a build script to package.json:
"scripts": {
  "build": "tsc"
}
```

**Important:** Make sure `dist/index.js` and `dist/index.d.ts` exist before using the package.

### 6. Add Package to Consuming Apps

In the app that will use your package (e.g., `apps/web/package.json`):

```json
{
  "dependencies": {
    "@repo/your-package-name": "*",
    // ... other dependencies
  }
}
```

**Key Point:** Use `"*"` for workspace packages, not version numbers.

### 7. Install Dependencies

**Always run from the ROOT of the monorepo:**

```bash
cd /path/to/monorepo/root
npm install
```

This will:
- Link all workspace packages
- Install all dependencies
- Update `package-lock.json`

### 8. Import and Use

In your app code:

```typescript
// For Pattern A (dist/)
import { myFunction } from "@repo/your-package-name";

// For Pattern B (src/)
import { myFunction } from "@repo/your-package-name/index";
```

---

## Common Patterns

### Pattern 1: Package with External Dependencies

If your package needs external npm packages:

```json
{
  "name": "@repo/my-package",
  "dependencies": {
    "some-external-package": "^1.0.0",
    "@repo/another-workspace-package": "*"
  }
}
```

### Pattern 2: Package Using Another Workspace Package

If Package B needs Package A:

**Package A** (`packages/package-a/package.json`):
```json
{
  "name": "@repo/package-a",
  "exports": { ".": "./dist/index.js" }
}
```

**Package B** (`packages/package-b/package.json`):
```json
{
  "name": "@repo/package-b",
  "dependencies": {
    "@repo/package-a": "*"
  }
}
```

Then in Package B code:
```typescript
import { something } from "@repo/package-a";
```

### Pattern 3: Next.js App Using Workspace Package

**No special config needed!** Just:
1. Add to `apps/web/package.json` dependencies
2. Run `npm install` at root
3. Import normally

**Note:** Next.js handles workspace packages automatically. You don't need `transpilePackages` in `next.config.js` unless you're using TypeScript source files directly.

---

## Troubleshooting

### Error: "Module not found: Can't resolve '@repo/package-name'"

**Solutions:**
1. ✅ Check package name matches exactly (case-sensitive)
2. ✅ Verify package is in `apps/*/package.json` dependencies
3. ✅ Run `npm install` at root
4. ✅ Check `package.json` exports path is correct
5. ✅ For Pattern A: Ensure `dist/` folder exists with compiled files

### Error: "A metric/thing has already been registered"

**Solution:** Don't define the same thing in multiple packages. Define once in one package, import in others.

### Error: TypeScript can't find types

**Solutions:**
1. For Pattern A: Ensure `dist/index.d.ts` exists
2. For Pattern B: Ensure `types` field points to correct path
3. Check `tsconfig.json` includes the right files

### Build fails but dev works

**Solution:** Make sure `dist/` files are up to date. Rebuild:
```bash
cd packages/your-package
npx tsc
```

---

## Best Practices

1. **Package Naming:** Always use `@repo/package-name` format
2. **Dependencies:** Use `"*"` for workspace packages, not versions
3. **Exports:** Be consistent - either use `dist/` or `src/`, don't mix
4. **Install:** Always run `npm install` at root after adding packages
5. **Build Order:** If Package B depends on Package A, make sure A builds first (Turborepo handles this automatically)
6. **TypeScript:** If using `dist/`, keep `.d.ts` files in sync with source

---

## Example: Complete Package Creation

```bash
# 1. Create structure
mkdir -p packages/my-utils/src
cd packages/my-utils

# 2. Create package.json
cat > package.json << EOF
{
  "name": "@repo/my-utils",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {
    ".": "./dist/index.js"
  }
}
EOF

# 3. Create tsconfig.json
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "dist",
    "declaration": true,
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["src"]
}
EOF

# 4. Create source
cat > src/index.ts << EOF
export const hello = () => "Hello from my-utils!";
EOF

# 5. Build
npx tsc

# 6. Add to app (edit apps/web/package.json)
# Add: "@repo/my-utils": "*" to dependencies

# 7. Install
cd ../..
npm install

# 8. Use in app
# import { hello } from "@repo/my-utils";
```

---

## Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Create package | `mkdir -p packages/name/src` | Root |
| Install deps | `npm install` | Root |
| Build package | `npx tsc` | Package dir |
| Add to app | Edit `apps/*/package.json` | App dir |
| Test build | `npm run build` | Root or app |

---

**Remember:** The key is consistency. Pick a pattern (dist/ or src/) and stick with it across your packages!

