import { Client, Events, GatewayIntentBits } from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}. Watching roles for ${process.env.GUILD_ID}.`);
});

// On member update
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
	if (newMember.guild.id !== process.env.GUILD_ID) return;

	// Roles as array of IDs
	const roles = newMember.roles.cache.map(role => role.id);

	if (roles.length === 0) return;

	try {
		// Create or update user in database and include roles
		await prisma.user.upsert({
			where: { discord_id: newMember.id },
			update: {
				username: newMember.user.username,
				roles: roles,
			},
			create: {
				discord_id: newMember.id,
				username: newMember.user.username,
				roles: roles,
			}
		});
	} catch (error) {
		console.error(error);
	}
});

client.login(process.env.BOT_TOKEN);