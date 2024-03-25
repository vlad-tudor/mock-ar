# Project Overview

This project is a simulation of an Augmented Reality (AR) experience using GPS and accelerometers. It is built with TypeScript and utilizes THREE.js for 3D graphics rendering.

To improve debugging and error tracking, it is recommended to use the logging server available at [https://github.com/vlad-tudor/logging-server](https://github.com/vlad-tudor/logging-server).

## Simple Setup Guide

Will NOT working with logging server

1. **Install Dependencies:** by executing `npm install` to install all the required dependencies.
2. **Start the Server:** by executing `npm start` to run the development server on [https://localhost:3000](https://localhost:3000).
3. ensure `.env` file does NOT have `VITE_HOST` set.

## Advanced Setup Guide (Recommended)

For deploying the application through a cloud server:

### Prerequisites

- **Domain Name:** You must own a domain name to generate valid SSL certificates.
- **SSL Certificate:** A valid SSL certificate and private key for your domain.
- **Cloud Server:** A server (e.g., DigitalOcean, AWS, Google Cloud) with an IP address that your domain name points to, and into which you can SSH.

### Steps

1. **Cloud Server Setup:**

   - Install your ssl certificate and private key on the server.
   - Install Nginx

2. **Nginx Configuration:**

```nginx
# /etc/nginx/sites-available/default

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/your_ssl_certificate.cer;
    ssl_certificate_key /path/to/your_private_key.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # OPTIONAL: Add a location block for API routing (logging server, etc.)
    location /api {
        rewrite ^/api(/.*)$ $1 break;
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

_NOTE 1: If integrating a logging server, don't forget to update the `.env` file with the logging server URL (`VITE_LOG_SERVER_URL=https://yourDomain.com/api/`)_

_NOTE 2: don't forget to run `nginx -t` and `systemctl restart nginx`. _

3. **SSH Configuration for Port Forwarding:**

   - Enable SSH port forwarding by editing `~/.ssh/config` and adding `GatewayPorts yes`.
   - Map your local development port to the cloud server using SSH reverse proxy: `ssh -R 3000:localhost:3000 yourUsername@yourServerIP`.
   - For more help on ssh port forwarding, refer to [this guide](https://www.ssh.com/ssh/tunneling/example).

4. **Running the Application:**

   - Add your domain to the `.env` file `VITE_HOST=yourDomain.com` (no https:// or trailing slash)
   - Install dependencies by running `npm install`.
   - Launch the application with `npm start`.
   - Access it through your domain in a web browser.

5. Debugging:
   - Sometimes the previous SSH connection might not be closed properly. In this case, you can kill the process by running `lsof -i :3000` and `kill -9 <PID>`.
