# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Deployment to Railway

This project is configured to deploy easily on Railway. Follow these steps:

### Prerequisites

1. A [Railway](https://railway.app) account
2. [Railway CLI](https://docs.railway.app/develop/cli) installed (optional but recommended)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

#### Option 1: Deploy via Railway Dashboard

1. **Create a New Project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` environment variable

3. **Configure Environment Variables**
   - Go to your service's "Variables" tab
   - Add the following variables:
     - `PAYLOAD_SECRET`: Generate a secure random string (e.g., using `openssl rand -base64 32`)
     - `NEXT_PUBLIC_SERVER_URL`: Will be auto-set by Railway, or use your custom domain
     - `NODE_OPTIONS`: `--no-deprecation` (optional)

4. **Deploy**
   - Railway will automatically detect the `railway.json` configuration
   - Your app will build using `pnpm install && pnpm build`
   - It will start with `pnpm start`
   - Wait for the deployment to complete

5. **Access Your App**
   - Once deployed, Railway provides a public URL
   - Click on the URL to access your application
   - Create your first admin user at `/admin`

#### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to your project (or create new one)
railway link

# Add PostgreSQL
railway add

# Set environment variables
railway variables set PAYLOAD_SECRET=your-secret-key-here

# Deploy
railway up
```

### Custom Domain (Optional)

1. Go to your service settings in Railway
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Update your DNS records as instructed
5. Update `NEXT_PUBLIC_SERVER_URL` to your custom domain

### Important Notes

- Railway automatically provisions PostgreSQL with sufficient storage and connection pooling
- The `DATABASE_URL` is automatically injected by Railway
- Make sure to generate a strong `PAYLOAD_SECRET` for production
- Railway uses Nixpacks to detect and build your project automatically
- Your build and start commands are defined in `railway.json`

### Troubleshooting

- **Build Failures**: Check the build logs in Railway dashboard
- **Database Connection**: Ensure PostgreSQL service is running and `DATABASE_URL` is set
- **Memory Issues**: Upgrade your Railway plan if needed for larger projects
- **Port Issues**: Railway automatically assigns a PORT variable, Next.js uses this by default

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
