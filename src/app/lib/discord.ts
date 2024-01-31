import DiscordOauth2, { TokenRequestResult } from 'discord-oauth2';

export const scope = ["identify", "guilds.members.read"];

const oauth = new DiscordOauth2({
	clientId: process.env.CLIENT_ID as string,
	clientSecret: process.env.CLIENT_SECRET as string,
	redirectUri: process.env.REDIRECT_URI as string,
});

export function generateAuthUrl(state: string): string {
	const url = oauth.generateAuthUrl({
		"scope": scope,
		"state": state
	});

	return url;
}

export async function getToken(code: string): Promise<TokenRequestResult> {
	const token = await oauth.tokenRequest({
		"clientId": process.env.CLIENT_ID as string,
		"clientSecret": process.env.CLIENT_SECRET as string,
		"code": code,
		"grantType": "authorization_code",
		"redirectUri": process.env.REDIRECT_URI as string,
		"scope": scope.join(" "),
	});

	return token;
}

export async function getMember(access_token: string): Promise<DiscordOauth2.Member> {
	const user = await oauth.getGuildMember(access_token, process.env.GUILD_ID as string);

	return user;
}