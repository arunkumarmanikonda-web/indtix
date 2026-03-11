#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# INDTIX Production Setup Script
# Run this script from the webapp/ directory: bash scripts/setup-production.sh
# ═══════════════════════════════════════════════════════════════════════════════

set -e
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log()   { echo -e "${GREEN}✅  $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠️   $1${NC}"; }
info()  { echo -e "${BLUE}ℹ️   $1${NC}"; }
error() { echo -e "${RED}❌  $1${NC}"; }
step()  { echo -e "\n${PURPLE}${BOLD}━━━ STEP $1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
header(){ echo -e "${PURPLE}${BOLD}$1${NC}"; }

clear
header "
╔══════════════════════════════════════════════════════════╗
║         INDTIX — Production Setup Script v78             ║
║         Cloudflare Pages + D1 + KV + Workers            ║
╚══════════════════════════════════════════════════════════╝
"

info "This script will guide you through all 8 production setup steps."
info "Prerequisites: Node.js, npm, wrangler CLI, git"
echo ""

# ─── CHECK PREREQUISITES ────────────────────────────────────────────────────
step "0: Checking Prerequisites"

if ! command -v node &> /dev/null; then
  error "Node.js not found. Install from https://nodejs.org"
  exit 1
fi
log "Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
  error "npm not found."
  exit 1
fi
log "npm $(npm --version)"

if ! command -v wrangler &> /dev/null && ! npx wrangler --version &> /dev/null; then
  warn "wrangler not found globally. Installing..."
  npm install -g wrangler
fi
log "Wrangler $(npx wrangler --version 2>/dev/null | head -1)"

if ! command -v git &> /dev/null; then
  error "git not found. Install from https://git-scm.com"
  exit 1
fi
log "git $(git --version)"


# ─── STEP 1: GitHub Push ────────────────────────────────────────────────────
step "1: Push to GitHub"

echo ""
info "Current git status:"
git status --short

echo ""
echo -e "${YELLOW}ACTION REQUIRED: Enter your GitHub repository URL${NC}"
echo -e "  Example: https://github.com/yourusername/indtix"
read -p "  GitHub repo URL (or press Enter to skip): " GITHUB_URL

if [[ -n "$GITHUB_URL" ]]; then
  # Remove any trailing .git
  GITHUB_URL="${GITHUB_URL%.git}"
  GIT_URL_SSH="git@github.com:${GITHUB_URL#https://github.com/}.git"
  GIT_URL_HTTPS="${GITHUB_URL}.git"

  if git remote get-url origin &> /dev/null; then
    warn "Remote 'origin' already set to: $(git remote get-url origin)"
    read -p "  Update to $GIT_URL_HTTPS? (y/N): " UPDATE_REMOTE
    if [[ "$UPDATE_REMOTE" == "y" || "$UPDATE_REMOTE" == "Y" ]]; then
      git remote set-url origin "$GIT_URL_HTTPS"
      log "Remote updated to $GIT_URL_HTTPS"
    fi
  else
    git remote add origin "$GIT_URL_HTTPS"
    log "Remote added: $GIT_URL_HTTPS"
  fi

  echo ""
  info "Pushing to GitHub (branch: main)..."
  git push -u origin main 2>&1 | tail -5 && log "Pushed to GitHub!" || {
    warn "Push failed. You may need to:"
    echo "  1. Create the repo on GitHub first (https://github.com/new)"
    echo "  2. Set up SSH key or use Personal Access Token"
    echo "  3. Run: git push -u origin main"
  }
else
  warn "Skipping GitHub push. Run manually: git push -u origin main"
fi


# ─── STEP 2: Wrangler Login ─────────────────────────────────────────────────
step "2: Cloudflare Authentication"

echo ""
info "You need to be logged in to Cloudflare wrangler."
read -p "  Login to Cloudflare? (y/N): " DO_LOGIN
if [[ "$DO_LOGIN" == "y" || "$DO_LOGIN" == "Y" ]]; then
  npx wrangler login
  log "Logged in to Cloudflare"
else
  warn "Skipping — run 'wrangler login' manually if needed"
fi


# ─── STEP 3: D1 Database ────────────────────────────────────────────────────
step "3: Create Cloudflare D1 Database"

echo ""
info "Creating D1 database: INDTIX_DB"
echo ""

read -p "  Create D1 database now? (y/N): " CREATE_D1
if [[ "$CREATE_D1" == "y" || "$CREATE_D1" == "Y" ]]; then
  D1_OUTPUT=$(npx wrangler d1 create INDTIX_DB 2>&1)
  echo "$D1_OUTPUT"

  # Extract database_id
  DB_ID=$(echo "$D1_OUTPUT" | grep -oP '"database_id":\s*"\K[^"]+' | head -1)
  if [[ -z "$DB_ID" ]]; then
    DB_ID=$(echo "$D1_OUTPUT" | grep -oP 'database_id = "\K[^"]+' | head -1)
  fi

  if [[ -n "$DB_ID" ]]; then
    log "Database created! ID: $DB_ID"
    # Update wrangler.jsonc
    sed -i "s/YOUR_D1_DATABASE_ID_HERE/$DB_ID/g" wrangler.jsonc
    log "Updated wrangler.jsonc with database_id: $DB_ID"
  else
    warn "Could not auto-extract database_id. Update wrangler.jsonc manually."
    echo "  Look for 'database_id' in the output above and replace"
    echo "  'YOUR_D1_DATABASE_ID_HERE' in wrangler.jsonc"
  fi

  # Apply schema
  echo ""
  info "Applying database schema..."
  npx wrangler d1 execute INDTIX_DB --file=db/schema.sql && log "Schema applied!"
  npx wrangler d1 execute INDTIX_DB --file=db/seed.sql && log "Seed data inserted!"
else
  warn "Skipping D1. Run manually:"
  echo "  npx wrangler d1 create INDTIX_DB"
  echo "  → Copy database_id to wrangler.jsonc"
  echo "  npx wrangler d1 execute INDTIX_DB --file=db/schema.sql"
  echo "  npx wrangler d1 execute INDTIX_DB --file=db/seed.sql"
fi


# ─── STEP 4: KV Namespace ───────────────────────────────────────────────────
step "4: Create Cloudflare KV Namespace"

echo ""
read -p "  Create KV namespace (for OTP store, cache)? (y/N): " CREATE_KV
if [[ "$CREATE_KV" == "y" || "$CREATE_KV" == "Y" ]]; then
  KV_OUTPUT=$(npx wrangler kv namespace create CACHE 2>&1)
  echo "$KV_OUTPUT"
  KV_ID=$(echo "$KV_OUTPUT" | grep -oP '"id":\s*"\K[^"]+' | head -1)
  if [[ -n "$KV_ID" ]]; then
    sed -i "s/YOUR_KV_NAMESPACE_ID_HERE/$KV_ID/g" wrangler.jsonc
    log "KV namespace created! ID: $KV_ID"
  fi

  KV_PREVIEW_OUTPUT=$(npx wrangler kv namespace create CACHE --preview 2>&1)
  KV_PREVIEW_ID=$(echo "$KV_PREVIEW_OUTPUT" | grep -oP '"id":\s*"\K[^"]+' | head -1)
  if [[ -n "$KV_PREVIEW_ID" ]]; then
    sed -i "s/YOUR_KV_PREVIEW_NAMESPACE_ID_HERE/$KV_PREVIEW_ID/g" wrangler.jsonc
    log "KV preview namespace created! ID: $KV_PREVIEW_ID"
  fi
else
  warn "Skipping KV. Run: wrangler kv namespace create CACHE"
fi


# ─── STEP 5: Set Secrets ────────────────────────────────────────────────────
step "5: Set Cloudflare Secrets"

echo ""
info "Setting required secrets for production..."
echo ""

# JWT Secret
echo -e "${YELLOW}5a. JWT Secret (REQUIRED — for user session tokens)${NC}"
read -p "  Set JWT_SECRET now? (y/N): " SET_JWT
if [[ "$SET_JWT" == "y" || "$SET_JWT" == "Y" ]]; then
  JWT_VAL=$(openssl rand -hex 32 2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(32))")
  echo "$JWT_VAL" | npx wrangler secret put JWT_SECRET && log "JWT_SECRET set! (auto-generated: ${JWT_VAL:0:8}...)"
fi

# Razorpay
echo ""
echo -e "${YELLOW}5b. Razorpay Keys (for real payments)${NC}"
info "Get from: https://dashboard.razorpay.com/app/keys"
read -p "  Set Razorpay keys now? (y/N): " SET_RZP
if [[ "$SET_RZP" == "y" || "$SET_RZP" == "Y" ]]; then
  read -p "  RAZORPAY_KEY_ID (rzp_live_xxx or rzp_test_xxx): " RZP_KEY_ID
  read -sp "  RAZORPAY_KEY_SECRET: " RZP_KEY_SECRET; echo ""
  read -sp "  RAZORPAY_WEBHOOK_SECRET (from RZP Dashboard > Webhooks): " RZP_HOOK; echo ""
  echo "$RZP_KEY_ID" | npx wrangler secret put RAZORPAY_KEY_ID && log "RAZORPAY_KEY_ID set"
  echo "$RZP_KEY_SECRET" | npx wrangler secret put RAZORPAY_KEY_SECRET && log "RAZORPAY_KEY_SECRET set"
  echo "$RZP_HOOK" | npx wrangler secret put RAZORPAY_WEBHOOK_SECRET && log "RAZORPAY_WEBHOOK_SECRET set"
fi

# SendGrid
echo ""
echo -e "${YELLOW}5c. SendGrid API Key (for email OTP)${NC}"
info "Get from: https://app.sendgrid.com/settings/api_keys"
read -p "  Set SENDGRID_API_KEY now? (y/N): " SET_SG
if [[ "$SET_SG" == "y" || "$SET_SG" == "Y" ]]; then
  read -sp "  SENDGRID_API_KEY (SG.xxx...): " SG_KEY; echo ""
  echo "$SG_KEY" | npx wrangler secret put SENDGRID_API_KEY && log "SENDGRID_API_KEY set"
fi

# Turnstile
echo ""
echo -e "${YELLOW}5d. Cloudflare Turnstile (CAPTCHA)${NC}"
info "Get from: https://dash.cloudflare.com → Turnstile → Add Widget"
read -p "  Set Turnstile keys now? (y/N): " SET_TS
if [[ "$SET_TS" == "y" || "$SET_TS" == "Y" ]]; then
  read -p "  TURNSTILE_SITE_KEY (public, shown in login form): " TS_SITE
  read -sp "  TURNSTILE_SECRET_KEY (private, verify on server): " TS_SECRET; echo ""
  # Update vars in wrangler.jsonc (site key is public)
  sed -i "s/YOUR_TURNSTILE_SITE_KEY_HERE/$TS_SITE/g" wrangler.jsonc
  echo "$TS_SECRET" | npx wrangler secret put TURNSTILE_SECRET_KEY && log "Turnstile keys set"
fi

# Cloudflare Images
echo ""
echo -e "${YELLOW}5e. Cloudflare Images (CDN image hosting)${NC}"
info "Get from: https://dash.cloudflare.com → Images"
read -p "  Set Cloudflare Images config now? (y/N): " SET_CF_IMG
if [[ "$SET_CF_IMG" == "y" || "$SET_CF_IMG" == "Y" ]]; then
  read -p "  CF_ACCOUNT_ID (from CF dashboard URL): " CF_ACCT
  read -sp "  CF_IMAGES_API_TOKEN (create at CF → API Tokens): " CF_IMG_TOKEN; echo ""
  read -p "  CF_IMAGES_ACCOUNT_HASH (from CF → Images → Account Hash): " CF_IMG_HASH
  echo "$CF_ACCT" | npx wrangler secret put CF_ACCOUNT_ID && log "CF_ACCOUNT_ID set"
  echo "$CF_IMG_TOKEN" | npx wrangler secret put CF_IMAGES_API_TOKEN && log "CF_IMAGES_API_TOKEN set"
  echo "$CF_IMG_HASH" | npx wrangler secret put CF_IMAGES_ACCOUNT_HASH && log "CF_IMAGES_ACCOUNT_HASH set"
fi


# ─── STEP 6: Build ──────────────────────────────────────────────────────────
step "6: Build Production Bundle"

echo ""
info "Running: npm run build"
npm run build && log "Build successful! dist/_worker.js created."


# ─── STEP 7: Deploy ─────────────────────────────────────────────────────────
step "7: Deploy to Cloudflare Pages"

echo ""
read -p "  Deploy to Cloudflare Pages now? (y/N): " DO_DEPLOY
if [[ "$DO_DEPLOY" == "y" || "$DO_DEPLOY" == "Y" ]]; then
  npx wrangler pages deploy dist --project-name=webapp 2>&1 | tail -10 && log "Deployed!"
  echo ""
  info "Your site is live at: https://webapp.pages.dev"
  info "To use a custom domain: CF Dashboard → Pages → webapp → Custom Domains"
else
  warn "Skipping deploy. Run manually: npx wrangler pages deploy dist --project-name=webapp"
fi


# ─── STEP 8: Configure Razorpay Webhook ─────────────────────────────────────
step "8: Configure Razorpay Webhook URL"

echo ""
info "After deployment, configure Razorpay to send webhooks to:"
echo ""
echo -e "  ${BOLD}https://webapp.pages.dev/api/payments/webhook${NC}"
echo ""
echo "  Steps:"
echo "  1. Login to Razorpay Dashboard: https://dashboard.razorpay.com"
echo "  2. Go to: Account & Settings → Webhooks"
echo "  3. Click: Add New Webhook"
echo "  4. URL: https://webapp.pages.dev/api/payments/webhook"
echo "  5. Select events: payment.captured, payment.failed, refund.created"
echo "  6. Enter the RAZORPAY_WEBHOOK_SECRET you set in Step 5"
echo ""
log "Webhook URL documented above!"


# ─── FINAL SUMMARY ──────────────────────────────────────────────────────────
echo ""
header "
╔══════════════════════════════════════════════════════════╗
║              ✅  SETUP COMPLETE — SUMMARY               ║
╚══════════════════════════════════════════════════════════╝
"
echo ""
echo -e "  ${GREEN}Platform:${NC}    INDTIX v78"
echo -e "  ${GREEN}Framework:${NC}   Hono on Cloudflare Workers"
echo -e "  ${GREEN}Database:${NC}    Cloudflare D1 (SQLite at edge)"
echo -e "  ${GREEN}Cache:${NC}       Cloudflare KV"
echo -e "  ${GREEN}Auth:${NC}        JWT (PBKDF2 + HS256) + OTP (SendGrid)"
echo -e "  ${GREEN}CAPTCHA:${NC}     Cloudflare Turnstile"
echo -e "  ${GREEN}Payments:${NC}    Razorpay (order + webhook verified)"
echo -e "  ${GREEN}Images:${NC}      Cloudflare Images CDN"
echo -e "  ${GREEN}CMS:${NC}         D1 / Contentful / Sanity (configurable)"
echo ""
echo -e "  ${YELLOW}Demo Login URLs:${NC}"
echo "    Fan:      /fan      → fan@indtix.com / Fan@123456"
echo "    Admin:    /admin    → admin@indtix.com / Admin@123456"
echo "    Org:      /organiser → organiser@indtix.com / Org@123456"
echo "    Venue:    /venue    → venue@indtix.com / Venue@123456"
echo "    EM:       /event-manager → em@indtix.com / EM@123456"
echo "    Ops:      /ops      → ops@indtix.com / Ops@123456"
echo ""
echo -e "  ${BLUE}Next Steps:${NC}"
echo "    1. Replace demo credentials in src/auth.ts with real user DB queries"
echo "    2. Configure email sender domain in SendGrid (verify noreply@indtix.com)"
echo "    3. Set up Cloudflare DNS for custom domain (www.indtix.com)"
echo "    4. Enable Cloudflare Web Analytics"
echo "    5. Run: npx playwright test --reporter=html"
echo ""
