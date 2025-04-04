# Use official Node.js image
FROM node:22.1.0

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma client if schema exists
RUN test -f "./prisma/schema.prisma" && npx prisma generate || echo "No Prisma schema found"

# Build the project
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
