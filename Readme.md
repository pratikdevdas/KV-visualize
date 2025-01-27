# Cloudflare KV Manager

This project allows you to manage your LOCAL Cloudflare KV stores using a web interface.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Wrangler configuration file (wrangler.toml) with KV namespace settings

## Quick Start

1. **Configure KV Namespace**: 
   - Add your local KV namespace to the `wrangler.toml` file
   - Remove any `preview_id` if present
   - Note: This setup works only locally

2. **Start the Application**:
   ```bash
   npm start
   ```
   This will build and start both the client and server in Docker containers.

3. **Access the Application**:
   Open your browser and navigate to `http://localhost`

## Development

- `npm run dev` - Start the application in development mode
- `npm run build` - Build the Docker images
- `npm run stop` - Stop all containers

## Data Persistence

KV data is persisted in the `./wrangler-data` directory, which is mounted as a volume in the Docker container.

> **Important**: Please do not add a `preview_id` in KV namespaces. A remote id is specifically there to point to remote resources in cloudflare.
