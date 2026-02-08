# Migration to Custom Domain Setup

**Current Setup (Temporary):**
- Frontend: `https://jensei-rose.vercel.app`
- Backend: `https://jensei.onrender.com`
- Auth: Cookies with `sameSite: 'none'` (cross-domain workaround)

**Target Setup (Production-Ready):**
- Frontend: `https://jensei.com`
- Backend: `https://api.jensei.com`
- Auth: Cookies with `sameSite: 'lax'` (secure, same-domain)

---

## Migration Steps

### Phase 1: DNS Configuration

1. **Point frontend domain to Vercel:**
   ```
   jensei.com → Vercel
   www.jensei.com → Vercel (redirect to non-www)
   ```

   In your DNS provider (e.g., Cloudflare, GoDaddy):
   - Add A record: `jensei.com` → Vercel IP (from Vercel dashboard)
   - Add CNAME: `www.jensei.com` → `cname.vercel-dns.com`

2. **Point backend subdomain to Render:**
   ```
   api.jensei.com → Render
   ```

   In your DNS provider:
   - Add CNAME: `api.jensei.com` → `jensei.onrender.com`

3. **Add custom domains in platforms:**
   - **Vercel Dashboard** → Project Settings → Domains → Add `jensei.com` and `www.jensei.com`
   - **Render Dashboard** → Web Service → Settings → Custom Domain → Add `api.jensei.com`

4. **Wait for SSL certificates** (5-30 minutes for both platforms to provision)

---

### Phase 2: Environment Variables Update

**Render (Backend):**
```env
FRONTEND_URL=https://jensei.com
BACKEND_URL=https://api.jensei.com
NODE_ENV=production
```

**Vercel (Frontend):**
```env
VITE_API_URL=https://api.jensei.com
VITE_API_BASE_URL=https://api.jensei.com
```

---

### Phase 3: Code Changes

#### 1. Update CORS Configuration

**File:** `server.js` (lines 38-67)

```javascript
// BEFORE (temporary)
const productionUrls = [
  'https://www.jensei.com',
  'https://jensei.com',
  'https://jensei-rose.vercel.app', // Vercel deployment (temporary)
];

// AFTER (production)
const productionUrls = [
  'https://www.jensei.com',
  'https://jensei.com',
];
```

#### 2. Revert Cookie Settings to Secure Defaults

**File:** `controllers/authController.js` (lines 159-166 and 268-275)

```javascript
// BEFORE (temporary cross-domain fix)
res.cookie('token', token, {
  httpOnly: true,
  secure: true, // Always true for cross-domain cookies
  sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-domain in production
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// AFTER (production - same domain)
res.cookie('token', token, {
  httpOnly: true,
  secure: isProduction, // true in production, false in dev
  sameSite: isProduction ? 'lax' : 'lax', // 'lax' is secure for same-domain
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

**File:** `controllers/googleAuthController.js` (lines 108-115)

```javascript
// Same changes as above
res.cookie('token', token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'lax' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

---

### Phase 4: Deployment & Testing

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "chore: Migrate to custom domain setup (jensei.com and api.jensei.com)"
   git push origin main
   ```

2. **Wait for auto-deployment** on both Render and Vercel

3. **Test authentication flow:**
   - Visit `https://jensei.com`
   - Login
   - Open DevTools → Application → Cookies
   - Verify cookie settings:
     - Domain: `.jensei.com` ✅
     - SameSite: `Lax` ✅
     - Secure: `true` ✅
     - HttpOnly: `true` ✅

4. **Test dashboard APIs:**
   ```bash
   # After logging in on frontend, test API from browser console:
   fetch('https://api.jensei.com/api/appointments/doctor/:id/statistics', {
     credentials: 'include'
   }).then(r => r.json()).then(console.log)
   ```

5. **Verify CORS:**
   - Check browser console for CORS errors (should be none)
   - Try API calls from `https://jensei.com` (should work)

---

### Phase 5: Update Documentation

1. Update `README.md`:
   - Change all URLs from `jensei-rose.vercel.app` to `jensei.com`
   - Change all URLs from `jensei.onrender.com` to `api.jensei.com`

2. Update `DASHBOARD_APIS.md`:
   - Base URL: `https://api.jensei.com/api`

3. Notify dashboard team of new API base URL

---

## Rollback Plan (If Issues Occur)

If something breaks during migration:

1. **Revert DNS changes:**
   - Remove custom domain from Vercel/Render dashboards
   - Point domains back to temporary setup

2. **Revert environment variables:**
   ```env
   FRONTEND_URL=https://jensei-rose.vercel.app
   VITE_API_URL=https://jensei.onrender.com
   ```

3. **Revert code changes:**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## Security Improvements After Migration

Once on same domain (jensei.com + api.jensei.com):

✅ **CSRF Protection:** `sameSite: 'lax'` prevents cross-site request forgery
✅ **No Third-Party Cookies:** Works even with strict browser privacy settings
✅ **Future-Proof:** Compatible with upcoming browser cookie policies
✅ **Professional:** Custom domain looks better than *.vercel.app URLs

---

## Estimated Time

- **DNS Configuration:** 10 minutes
- **SSL Provisioning:** 5-30 minutes (automatic)
- **Code Changes:** 5 minutes
- **Testing:** 15 minutes
- **Total:** ~1 hour

---

## Questions?

If you encounter issues during migration, check:
1. DNS propagation (can take 24-48 hours, but usually < 1 hour)
2. SSL certificate status on Vercel/Render dashboards
3. CORS errors in browser console
4. Cookie domain in DevTools → Application → Cookies
