FROM node:18-alpine

# Install wrangler
RUN npm install -g wrangler

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"] 