# Deployment Guide for Hostinger VPS

## Prerequisites

- Node.js 18+ installed on VPS
- PM2 for process management
- Nginx as reverse proxy
- Git installed

## 1. Initial VPS Setup

SSH into your VPS:
```bash
ssh root@your-vps-ip
```

Install Node.js (if not installed):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Install PM2:
```bash
npm install -g pm2
```

## 2. Clone Repository

```bash
cd /var/www
git clone https://github.com/yourusername/Web Wise-next.git
cd Web Wise-next
```

## 3. Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
nano .env.local
```

Fill in the following values:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your-bing-verification-code
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
INDEXNOW_API_KEY=your-random-api-key
```

## 4. Get Your API Keys

### Google Analytics
1. Go to https://analytics.google.com/
2. Create a property for websiteandseoagency.com
3. Get the Measurement ID (starts with G-)

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: https://www.websiteandseoagency.com
3. Choose "HTML tag" verification method
4. Copy the content value from the meta tag

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Get the verification code

### reCAPTCHA v3
1. Go to https://www.google.com/recaptcha/admin
2. Create a new site (v3)
3. Add your domain: websiteandseoagency.com
4. Get the Site Key and Secret Key

### IndexNow
1. Generate a random string (e.g., using `openssl rand -hex 16`)
2. Use this as your INDEXNOW_API_KEY

## 5. Install Dependencies & Build

```bash
npm install
npm run build
```

## 6. Start with PM2

```bash
pm2 start npm --name "Web Wise" -- start
pm2 save
pm2 startup
```

## 7. Configure Nginx

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/Web Wise
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name websiteandseoagency.com www.websiteandseoagency.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/Web Wise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d websiteandseoagency.com -d www.websiteandseoagency.com
```

## 9. Post-Deployment SEO Setup

### Submit Sitemap
1. Google Search Console: Submit https://www.websiteandseoagency.com/sitemap.xml
2. Bing Webmaster: Submit the same sitemap

### Trigger IndexNow
After deployment, submit your URLs for fast indexing:
```bash
curl -X POST https://www.websiteandseoagency.com/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://www.websiteandseoagency.com/", "https://www.websiteandseoagency.com/services", "https://www.websiteandseoagency.com/portfolio", "https://www.websiteandseoagency.com/blog", "https://www.websiteandseoagency.com/contact"]}'
```

### LLM Indexing
Your site has llms.txt files for AI discovery:
- https://www.websiteandseoagency.com/llms.txt (summary)
- https://www.websiteandseoagency.com/llms-full.txt (detailed)

## 10. Update Deployment

When you push updates:
```bash
cd /var/www/Web Wise-next
git pull origin main
npm install
npm run build
pm2 restart Web Wise
```

## Useful PM2 Commands

```bash
pm2 status          # Check status
pm2 logs Web Wise    # View logs
pm2 restart Web Wise # Restart app
pm2 stop Web Wise    # Stop app
pm2 delete Web Wise  # Remove from PM2
```

## Firewall (if using UFW)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Monitoring

- Check Google Analytics: https://analytics.google.com/
- Check Search Console: https://search.google.com/search-console
- Check site speed: https://pagespeed.web.dev/
- Check SEO: https://www.seobility.net/en/seocheck/
