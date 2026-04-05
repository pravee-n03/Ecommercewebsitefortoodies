The Netlify deploy errored, with the following guidance provided:

Diagnosis
- Relevant log lines:
  - [line 59](#L59) shows the build step ended with a non-zero exit code.
  - [lines 64–69](#L64-L69) show the bundler produced a folder named build/ (build/ index.html, build/assets/...).
  - [line 77](#L77) shows the site was "✓ built in 7.28s".
  - [line 90](#L90) is the actual deployment error: "Deploy directory 'dist' does not exist".
  - [line 99](#L99) shows Netlify's resolved publish directory is /opt/build/repo/dist.

Cause
- Vite (the detected framework) produced output into a "build" directory, but Netlify is configured to publish the "dist" directory. Netlify therefore cannot find the expected publish folder and fails the deploy step.

Solution
You have two ways to fix this; choose one:

Option A — Update Netlify to publish the actual build output ("build")
1. In the Netlify UI: Site settings → Build & deploy → Continuous Deployment → Build settings → Edit settings → set "Publish directory" to build (not dist).  
   OR commit a netlify.toml to the repo (recommended for reproducible builds) with:
```toml
[build]
  command = "npm run build"
  publish = "build"
```
2. Push the change and retry the deploy.

Option B — Make Vite output to dist (so it matches Netlify's current publish setting)
1. Verify your repo has vite.config.js or vite.config.ts in the project root. If present, update its build.outDir to "dist". Example:
```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist'
  }
})
```
2. If you don’t have a Vite config, add one as above.
3. Commit and push, then redeploy.

Notes / quick checks
- Confirm which option you prefer by checking the repo for a Vite config file (vite.config.ts or vite.config.js) and the actual output directory used during local builds.
- The build artifacts shown in the logs are under build/ ([lines 64–69](#L64-L69)), so changing Netlify’s publish directory to build is the quickest fix.
- The error about the missing publish directory is the blocker ([line 90](#L90)); once publish and build outDir match, deploy should succeed.

The relevant error logs are:

Line 0: Waiting for other deploys from your team to complete. Check the queue: https://app.netlify.com/teams/mithunkarthik19/builds
Line 1: build-image version: 37c27078fd36bc14c3fa8836175bd77aa6640872 (noble-new-builds)
Line 2: buildbot version: ee2c327a2718c921510fd736205acbb9fe49aa61
Line 3: Fetching cached dependencies
Line 4: Failed to fetch cache, continuing with build
Line 5: Starting to prepare the repo for build
Line 6: No cached dependencies found. Cloning fresh repo
Line 7: git clone --filter=blob:none https://github.com/bossmodeindia-source/Ecommercewebsitefortoodies
Line 8: Preparing Git Reference refs/heads/main
Line 9: Installing dependencies
Line 10: mise [36m~/.config/mise/config.toml[0m tools: [34mpython[0m@3.14.3
Line 11: mise [36m~/.config/mise/config.toml[0m tools: [34mruby[0m@3.4.8
Line 12: mise [36m~/.config/mise/config.toml[0m tools: [34mgo[0m@1.26.1
Line 13: v22.22.2 is already installed.
Line 14: Now using node v22.22.2 (npm v10.9.7)
Line 15: Enabling Node.js Corepack
Line 16: No npm workspaces detected
Line 17: Installing npm packages using npm version 10.9.7
Line 18: npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
Line 19: added 332 packages in 18s
Line 20: npm packages installed
Line 21: Successfully installed dependencies
Line 22: Detected 2 framework(s)
Line 23: "vite" at version "6.3.5"
Line 24: "hono" at version "4.12.10"
Line 25: Starting build script
Line 26: Section completed: initializing
Line 27: [96m[1m​[22m[39m
Line 28: [96m[1mNetlify Build                                                 [22m[39m
Line 49: [96m[1mBuild command from Netlify app                                [22m[39m
Line 50: [96m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 51: ​
Line 52: [36m$ npm run build[39m
Line 53: > E-commerce website for Toodies@0.1.0 build
Line 54: > vite build
Line 55: [36mvite v6.3.5 [32mbuilding for production...[36m[39m
Line 56: transforming...
Line 57: [32m✓[39m 2458 modules transformed.
Line 58: rendering chunks...
Line 59: Failed during stage 'building site': Build script returned non-zero exit code: 2
Line 60: [33m[plugin vite:reporter]
Line 61: (!) /opt/build/repo/src/utils/supabaseApi.ts is dynamically imported by /opt/build/repo/src/components/Advanced2DDesigner.tsx, /
Line 62: [39m
Line 63: computing gzip size...
Line 64: [2mbuild/[22m[32mindex.html                                                    [39m[1m[2m    0.45 kB[22m[1m[22m[2m │ g
Line 65: [2mbuild/[22m[2massets/[22m[32mc561690211cdd59869b2af6c111db0bf09f362da-N0pYf1Q8.png  [39m[1m[2m   56.36 kB[22m[1m[22
Line 66: [2mbuild/[22m[2massets/[22m[32m404faa741eb4394d917a24330c1566de438eea2b-Br9zz-wv.png  [39m[1m[2m   81.96 kB[22m[1m[22
Line 67: [2mbuild/[22m[2massets/[22m[35mindex-DJxFpPN-.css                                     [39m[1m[2m    6.63 kB[22m[1m[22
Line 68: [2mbuild/[22m[2massets/[22m[36mpurify.es-BgtpMKW3.js                                  [39m[1m[2m   22.77 kB[22m[1m[22
Line 69: [2mbuild/[22m[2massets/[22m[36mindex.es-DBfbFpEl.js                                   [39m[1m[2m  159.59 kB[22m[1m[22
Line 76: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
Line 77: [32m✓ built in 7.28s[39m
Line 78: ​
Line 79: [90m(build.command completed in 7.8s)[39m
Line 80: [96m[1m​[22m[39m
Line 81: [96m[1mDeploy site                                                   [22m[39m
Line 82: [96m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 83: ​
Line 84: Section completed: deploying
Line 85: [91m[1m​[22m[39m
Line 86: [91m[1mConfiguration error                                           [22m[39m
Line 87: [91m[1m────────────────────────────────────────────────────────────────[22m[39m
Line 88: ​
Line 89:   [31m[1mError message[22m[39m
Line 90:   Deploy did not succeed: Deploy directory 'dist' does not exist
Line 91: ​
Line 92:   [31m[1mResolved config[22m[39m
Line 93:   build:
Line 94:     command: npm run build
Line 95:     commandOrigin: ui
Line 96:     environment:
Line 97:       - VITE_SUPABASE_ANON_KEY
Line 98:       - VITE_SUPABASE_URL
Line 99:     publish: /opt/build/repo/dist
Line 100:     publishOrigin: ui
Line 101: Build failed due to a user error: Build script returned non-zero exit code: 2
Line 102: Failing build: Failed to build site
Line 103: Finished processing build request in 33.469s