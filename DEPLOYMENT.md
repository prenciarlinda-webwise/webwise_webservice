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
git clone https://github.com/yourusername/webwise-next.git
cd webwise-next
```

## 3. Install Dependencies & Build

```bash
npm install
npm run build
```

## 4. Create Environment File

```bash
cp .env.example .env.local
nano .env.local
```

Update `NEXT_PUBLIC_SITE_URL` with your actual domain.

## 5. Start with PM2

```bash
pm2 start npm --name "webwise" -- start
pm2 save
pm2 startup
```

## 6. Configure Nginx

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/webwise
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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
sudo ln -s /etc/nginx/sites-available/webwise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 8. Update Deployment

When you push updates:
```bash
cd /var/www/webwise-next
git pull origin main
npm install
npm run build
pm2 restart webwise
```

## Useful PM2 Commands

```bash
pm2 status          # Check status
pm2 logs webwise    # View logs
pm2 restart webwise # Restart app
pm2 stop webwise    # Stop app
pm2 delete webwise  # Remove from PM2
```

## Firewall (if using UFW)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```
