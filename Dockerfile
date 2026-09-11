# ---------- Stage 1: build compiled CSS + minified JS ----------
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# ---------- Stage 2: nginx serving static files ----------
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# Copy only what the site needs (no docs, backend, reference or node_modules – see .dockerignore too)
COPY --from=build /src/*.html /usr/share/nginx/html/
COPY --from=build /src/robots.txt /src/sitemap.xml /usr/share/nginx/html/
COPY --from=build /src/assets /usr/share/nginx/html/assets
RUN rm -f /usr/share/nginx/html/assets/css/input.css /usr/share/nginx/html/assets/css/styles.css /usr/share/nginx/html/assets/js/tailwind.config.js \
    && find /usr/share/nginx/html/assets -name "README.md" -delete
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/healthz >/dev/null || exit 1
