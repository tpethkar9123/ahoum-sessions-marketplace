# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Nginx config for frontend will be handled in the main Proxy container or simple static server
# But since the assignment requires Nginx as reverse proxy, we can use a basic Nginx here just for static files
# Actually, the reverse proxy can route to an Nginx serving frontend.
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
