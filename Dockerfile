# Stage 1: Build
FROM node:22.11.0-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application (.gitignore is required)
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Test (optional, if you need testing)
FROM build AS test
# Install Chrome for Karma tests
RUN apk add --no-cache chromium chromium-chromedriver
ENV CHROME_BIN=/usr/bin/chromium-browser

# Run unit tests
RUN npm run test -- --no-watch --no-progress --browsers=ChromeHeadless

# Install Playwright dependencies and run e2e tests
RUN apk add --no-cache \
    ffmpeg \
    libstdc++ \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

RUN npx playwright install --with-deps chromium
RUN npm run e2e

# Stage 3: Runtime
FROM node:22.11.0-alpine as runtime
WORKDIR /app

RUN npm install -g http-server
COPY --from=build /app/dist/ria-frontend /app
EXPOSE 8080

CMD ["http-server", "/app/browser", "-p", "8080"]