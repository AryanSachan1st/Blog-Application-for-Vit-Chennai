# ---------- Backend ----------
FROM node:18 AS server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .

# ---------- Frontend ----------
FROM node:18 AS client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install && npm run build
COPY client/ .

# ---------- Production ----------
FROM node:18
WORKDIR /app
COPY --from=server /app/server ./server
COPY --from=client /app/client/build ./client/build

WORKDIR /app/server
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
