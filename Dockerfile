# Use a stable Node.js version (LTS)
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files first (improves Docker caching)
COPY package*.json ./
COPY tsconfig.json tsconfig.build.json ./
COPY prisma ./prisma

# Install only production dependencies to reduce image size
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Generate Prisma client if schema exists
RUN test -f "./prisma/schema.prisma" && npx prisma generate || echo "Skipping prisma generate"

# Copy the rest of the application files
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the necessary port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
