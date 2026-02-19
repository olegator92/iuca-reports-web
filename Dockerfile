# syntax=docker/dockerfile:1.5

# --- Base stage ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Development stage ---
FROM base AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# --- Build stage ---
FROM base AS build
ENV NODE_ENV=production

# Build arguments for environment-specific configuration
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID

# Set environment variables from build args
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

COPY . .
RUN npm run build

# --- Production stage (NGINX) ---
FROM nginx:alpine AS prod

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
