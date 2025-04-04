# Use Node.js official image
FROM node:22.1.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies (including TypeScript & Prisma)
RUN npm install && npm install --save-dev @types/jsonwebtoken @prisma/client

# Copy the rest of the application files
COPY . .z

# Ensure `dist/` directory exists
RUN mkdir -p dist

# Generate Prisma client if schema exists
RUN test -f "./prisma/schema.prisma" && npx prisma generate || echo "No Prisma schema found"

# Build the project (TypeScript -> JavaScript)
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
