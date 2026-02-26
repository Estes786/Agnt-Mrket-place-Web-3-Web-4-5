# 📋 SESSION #017 — CI/CD GITHUB ACTIONS
## GANI HYPHA — Auto-Deploy Pipeline
### Status: ⏳ PENDING

---

## 🎯 TUJUAN

Setup GitHub Actions untuk auto-deploy ke Cloudflare Pages setiap push ke main.

---

## TODO LIST

### STEP 1: Buat .github/workflows/deploy.yml

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Pages
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: gani-hypha-web3
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### STEP 2: Add GitHub Secrets

Di GitHub repo → Settings → Secrets → Actions:
- `CLOUDFLARE_API_TOKEN`: fqHKTVctMcj2_b6BbzQNgktPyKpi_q4Bmv26Hy_jl
- `CLOUDFLARE_ACCOUNT_ID`: (dapatkan dari CF dashboard)

### STEP 3: Get Cloudflare Account ID

```bash
CLOUDFLARE_API_TOKEN=fqHKTVctMcj2_b6BbzQNgktPyKpi_q4Bmv26Hy_jl \
npx wrangler whoami
# Output akan include Account ID
```

### STEP 4: Test Workflow

```bash
git add .github/workflows/deploy.yml
git commit -m "Session 017: Add CI/CD GitHub Actions"
git push origin main
# Check GitHub Actions tab untuk lihat deployment
```

### STEP 5: Add Status Badge ke README

```markdown
![Deploy](https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5/actions/workflows/deploy.yml/badge.svg)
```

---

## 📊 SUCCESS CRITERIA

```
✅ .github/workflows/deploy.yml created
✅ GitHub secrets configured
✅ Push ke main triggers auto-deploy
✅ CF Pages deployed automatically
✅ Status badge di README
```

---

*Session #017 | GANI HYPHA | Planned*
