declare namespace Lucia {
	type Auth = import("./src/app/auth/lucia").Auth;
	type DatabaseUserAttributes = {
		username: string;
	};	
	type DatabaseSessionAttributes = {};
}