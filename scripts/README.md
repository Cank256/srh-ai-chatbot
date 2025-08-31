# SRH AI Chatbot Scripts

This directory contains utility scripts for the SRH AI Chatbot application.

## Available Scripts

### Database Setup

This script performs a complete database setup, including running migrations, creating an admin account if none exists, and setting up default system settings.

#### Usage

From the project root directory:

```bash
pnpm db:setup
```

Or from the scripts directory:

```bash
pnpm setup-db
```

You can also use this script during the build process:

```bash
pnpm build:with-setup
```

### Create Admin User

This script checks if an admin account exists in the database and creates a demo admin account if none is found.

#### Usage

From the project root directory:

```bash
pnpm db:create-admin
```

Or from the scripts directory:

```bash
pnpm create-admin
```

#### Default Admin Credentials

When the script creates a new admin account, it uses the following default credentials:

- **Email**: admin@example.com
- **Password**: Admin123!

**Important**: These are default credentials for development purposes only. Please change them after the first login in a production environment.

## Adding New Scripts

To add a new script:

1. Create a new TypeScript file in this directory
2. Add the script to the `scripts` section in both:
   - The main `package.json` in the project root
   - The `package.json` in the scripts directory