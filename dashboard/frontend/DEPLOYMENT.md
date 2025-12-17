# Deployment Guide - Vercel

## Deploy to brand-health-frontend-deploy Project

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Deploy Steps

#### Option 1: Using Vercel CLI (Recommended)

```bash
# Navigate to frontend directory
cd frontend

# Link to the specific Vercel project (first time only)
vercel link --project=brand-health-frontend-deploy

# Deploy to production
vercel --prod
```

#### Option 2: Using Git Integration

1. **Connect GitHub Repository to Vercel:**
   - Go to https://vercel.com/new
   - Import your Git repository
   - **IMPORTANT:** Select "brand-health-frontend-deploy" as the project
   - Set Root Directory to `frontend`

2. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables in Vercel Dashboard:**
   Go to Project Settings > Environment Variables and add:
   
   ```
   GOOGLE_CLOUD_PROJECT=trendle-469110
   BIGQUERY_DATASET=brand_health_dev
   BIGQUERY_LOCATION=US
   NEXT_PUBLIC_APP_NAME=TD Bank Health Monitor
   ```

4. **For BigQuery Access (Important!):**
   - Create a service account key in Google Cloud Console
   - Download the JSON key file
   - In Vercel, add environment variable:
     - Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
     - Value: Paste the entire contents of the service account JSON file
   
   - Update your BigQuery client initialization to handle this:
     ```typescript
     const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
       ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
       : undefined;
     
     const bigquery = new BigQuery({
       projectId: process.env.GOOGLE_CLOUD_PROJECT,
       credentials
     });
     ```

### Verify Deployment

After deployment:
1. Check the deployment URL: `https://brand-health-frontend-deploy.vercel.app`
2. Verify environment variables are set correctly
3. Test BigQuery data loading
4. Check browser console for any errors

### Common Issues

**Issue: Deployed to wrong project**
- Solution: Run `vercel unlink` in frontend directory, then `vercel link --project=brand-health-frontend-deploy`

**Issue: BigQuery authentication fails**
- Solution: Ensure `GOOGLE_APPLICATION_CREDENTIALS_JSON` is set in Vercel environment variables
- Check service account has BigQuery Data Viewer and Job User roles

**Issue: Build fails**
- Solution: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### Rollback

If you need to rollback:
```bash
vercel rollback [deployment-url]
```

Or use the Vercel dashboard to promote a previous deployment.

### Production Checklist

- [ ] Environment variables configured
- [ ] BigQuery service account credentials added
- [ ] Build succeeds locally
- [ ] Deployment linked to correct project
- [ ] Custom domain configured (if needed)
- [ ] Analytics configured (optional)
- [ ] Error monitoring configured (optional)

