# Cloudflare KV Manager

This project allows you to manage your LOCAL(create, delete, edit) your multiple Cloudflare KV stores locally.

## Steps to Get Started

1. **Install Node.js**: Ensure you have Node.js installed on your machine.
2. **Configure KV Namespace**: 
   - Add your KV namespace to the `wrangler.toml` file. 
   - If a `preview_id` exists, remove it. 
   - Note: This setup works only locally, so your KV might be empty at first, and there is no remote connection.
3. **Create a Directory**: 
   - Create a folder on your Desktop and name it `wrangler-data`.
4. **Install Packages**: 
   - Run the npm script to install packages in both directories.
   - Then, execute `npm start` to launch the project.

> **Important**: Please do not add a `preview_id` in KV namespaces.
