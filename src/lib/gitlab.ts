import 'dotenv/config';

function getConfig() {
	const config= {
		host: process.env.GITLAB_URL,
		path: process.env.GITLAB_PROJECT_PATH,
	}
	if (!Object.values(config).every(v => !!v)) {
		throw "Please make sure you specified GITLAB_URL and GITLAB_PROJECT_PATH in your .env file"
	}
	return config;
}

export function getGitLabLink(path: string) {
	const {host, path: basePath} = getConfig()
	return `${host}/${path}/-/blob/main/data/${path}?ref_type=heads`
}

export function getGitLabRoot() {
	const {host, path} = getConfig()
	return `${host}/${path}`
}