FROM node:22-alpine as build

WORKDIR /usr/src/app

# Copy package files
COPY ["package.json", "package-lock.json*", "./"]

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy nginx config for React app
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 8000;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
