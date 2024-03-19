## Discord role based authorization
This project uses Discord Oauth2 to authenticate users, and then uses their roles to determine what content they can access.

Roles are first stored when the Oauth2 is completed.
The discord bot will listen for discord role updates and update the database accordingly.

### What you need
1. PostgreSQL database 
2. Prisma CLI installed globally. [How do I install it?](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql)
2. Discord application with the `SERVER MEMBERS INTENT` enabled

### How to run
1. Clone the repo
2. Find the `.env.example` file in the root directory
3. Create a discord application [here](https://discord.com/developers/applications) and enable the `SERVER MEMBERS INTENT` in the bot section
![Alt text](docs/image.png)
4. Rename the `.env.example` file to `.env.local` and modify the following variables
```
DATABASE_URL="postgresql://user:pass@address:port/dbname?schema=public"
BOT_TOKEN="DISCORD BOT TOKEN"

GUILD_ID="DISCORD GUILD ID"
NEXT_PUBLIC_ROLE_ID="DISCORD ROLE"

CLIENT_ID="DISCORD CLIENT ID"
CLIENT_SECRET="DISCORD CLIENT SECRET"
REDIRECT_URI="http://localhost:3000/login/discord/callback"
```
5. Run `npm install`
6. Run `prisma db push` to create the database tables
6. Run `npm run dev` to start the webapp
7. Run `npm run bot` to start the discord bot

### Libraries used
- Next.js (React)
- TailwindCSS
- Prisma
- PostgreSQL
- Discord.js
- SWR
- iron-session
