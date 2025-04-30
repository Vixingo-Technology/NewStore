# Deployment Guide

This guide covers deploying Nuvion to various platforms.

## 🚀 Quick Deploy

### 1. Production Setup Check
```bash
npm run setup:production
```

This validates your environment and ensures everything is ready for deployment.

### 2. Build the Application
```bash
npm run build
```

### 3. Start Production Server
```bash
npm start
```

## 📋 Pre-Deployment Checklist

### Environment Variables
Ensure these are set in your deployment platform:

**Required:**
- `NEXT_PUBLIC_BASE_URL` - Your domain (e.g., `https://yoursite.com`)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

**Optional (for Cloudinary):**
- `CLOUDINARY_URL` - Cloudinary connection string
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Product Data
- Ensure `src/data/products.ts` contains your product catalog
- Run `npm run scrape:complete` if you need to populate products
- Verify images are in `public/images/` or Cloudinary URLs are used

## 🌐 Platform-Specific Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push your code to GitHub/GitLab
   - Connect repository to Vercel

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Set `NEXT_PUBLIC_BASE_URL` to your Vercel domain

3. **Deploy**
   - Vercel will automatically build and deploy
   - Custom domain can be added in settings

### Netlify

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   - Add all required environment variables in Netlify dashboard

3. **Deploy**
   - Connect repository and deploy

### Railway

1. **Create Project**
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Environment Variables**
   - Add all required environment variables

3. **Deploy**
   - Railway will build and deploy automatically

### Docker

1. **Build Image**
   ```bash
   docker build -t Nuvion .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
     -e STRIPE_SECRET_KEY=your_key \
     -e STRIPE_PUBLISHABLE_KEY=your_key \
     Nuvion
   ```

## 🔧 Post-Deployment

### 1. Test Payment Flow
- Use Stripe test cards to verify checkout works
- Test both success and failure scenarios

### 2. Verify Images
- Check that product images load correctly
- If using Cloudinary, verify uploads work

### 3. Monitor Performance
- Check Core Web Vitals in Google PageSpeed Insights
- Monitor error rates in your hosting platform

## 🛠️ Troubleshooting

### Build Failures
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint`
- Verify environment variables are set

### Image Issues
- If images don't load, check file paths in `products.ts`
- Consider using Cloudinary for better performance
- Verify image files exist in `public/images/`

### Payment Issues
- Verify Stripe keys are correct
- Check Stripe webhook configuration
- Test with Stripe's test mode first

### Performance Issues
- Enable image optimization in Next.js
- Consider using Cloudinary for image hosting
- Implement proper caching headers

## 📊 Analytics & Monitoring

### Recommended Tools
- **Vercel Analytics** (if using Vercel)
- **Google Analytics** for user behavior
- **Stripe Dashboard** for payment analytics
- **Sentry** for error monitoring

### Setup
1. Add analytics tracking codes to `src/app/layout.tsx`
2. Configure error monitoring
3. Set up payment webhooks for real-time data

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific secret management
- Rotate API keys regularly

### Payment Security
- Always use HTTPS in production
- Verify Stripe webhook signatures
- Implement proper error handling

### Image Security
- Validate image uploads (if implementing)
- Use proper CORS headers
- Consider image optimization

## 📈 Scaling Considerations

### Performance
- Implement proper caching strategies
- Use CDN for static assets
- Consider database for large product catalogs

### Infrastructure
- Monitor resource usage
- Set up auto-scaling if needed
- Implement proper logging

---

For more detailed information, see the main [README.md](./README.md).
