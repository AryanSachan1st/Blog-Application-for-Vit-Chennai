# ---------- Stage 1: Backend dependencies ----------
FROM node:18 AS server-deps
WORKDIR /app/server

# Copy package files and install dependencies
COPY server/package*.json ./
RUN npm install

# Copy backend source
COPY server/ .

# ---------- Stage 2: Frontend dependencies ----------
FROM node:18 AS client-deps
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy full frontend source (including public/index.html)
COPY client/ .

# ---------- Stage 3: Build frontend ----------
FROM client-deps AS client-build
WORKDIR /app/client

# Build React app with optional build-time env
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# ---------- Stage 4: Production ----------
FROM node:18 AS production
WORKDIR /app

# Copy backend code and dependencies
COPY --from=server-deps /app/server ./server

# Copy built frontend
COPY --from=client-build /app/client/build ./client/build

# Set working directory to server
WORKDIR /app/server

# Expose backend port
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["npm", "start"]
