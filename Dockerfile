## Build stage - Angular app
FROM node:22-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Build using production configuration (uses environment.prod.ts -> apiUrl '/api')
RUN npm run build

## Runtime stage - Nginx serving static files
FROM nginx:1.27-alpine AS final

COPY --from=build /usr/src/app/dist/booking-fe/browser /usr/share/nginx/html

# Basic nginx config: serve SPA and proxy /api to booking-api service
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

