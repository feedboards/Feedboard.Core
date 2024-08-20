export type TAzureTokenResponseDto = {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    accessTokenExpiredAt: string;
}

export type TURLResponse = {
    url: string;
}

export type TGithubTokenResponseDto = {
    userId: string;
    accessToken: string;
};
