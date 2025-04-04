FROM node:22.1.0

WORKDIR /app

# Copy necessary files first (to improve caching)
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY prisma ./prisma

# Install dependencies (including devDependencies)
ENV NODE_ENV=development
RUN npm install

# Generate Prisma client if schema exists
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

# Copy the rest of the application
COPY . .

# Compile TypeScript
RUN npm run build

# Set environment to production
ENV NODE_ENV=production

# Expose the necessary port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]