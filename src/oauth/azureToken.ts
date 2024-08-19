import { AccessToken, GetTokenOptions } from '@azure/identity';
import { TokenCredential } from '@azure/core-auth';
import { TAzureTokenResponseDto } from '../DTOs';

export class AzureToken implements TokenCredential {
    private static _token: TAzureTokenResponseDto | null;
    private static _isLogged: boolean = false;

    constructor();
    constructor(token: TAzureTokenResponseDto);
    constructor(token?: TAzureTokenResponseDto) {
        if (token) {
            AzureToken._token = token;
        }
    }

    /*
     * To get AzureToken instance use getActiveToken()
     *
     * @returns AccessToken (not AzureToken instance)
     */
    public async getToken(
        scopes: string | string[],
        options?: GetTokenOptions | undefined
    ): Promise<AccessToken | null> {
        if (AzureToken._token !== null && AzureToken.validateToken(AzureToken._token)) {
            return {
                token: AzureToken._token.accessToken,
                expiresOnTimestamp: AzureToken.convertToTimestamp(
                    AzureToken._token.accessTokenExpiredAt
                ),
            };
        }

        console.error('Token expired.');

        return null;
    }

    public isLogged(): boolean {
        return AzureToken._isLogged;
    }

    public getActiveToken(): AzureToken {
        if (!AzureToken.validateToken(AzureToken._token)) {
            throw new Error("token is expired");
        }

        return new AzureToken();
    }

    public getActiveTokenAsResponseDto(): TAzureTokenResponseDto | null {
        if (AzureToken._token !== null && AzureToken.validateToken(AzureToken._token)) {
            return AzureToken._token
        }

        return null;
    }

    public addTokenOrUpdate(token: TAzureTokenResponseDto): AzureToken {
        if (AzureToken.validateToken(token)) {
            throw new Error("token is expired");
        }

        AzureToken._token = token;
        AzureToken._isLogged = true;

        return this.getActiveToken();
    }

    private static validateToken(
        tokenOrExpiredAt: TAzureTokenResponseDto | string | number
    ): boolean {
        let expirationTime: number;

        if (typeof tokenOrExpiredAt === "number") {
            expirationTime = tokenOrExpiredAt;
        } else if (typeof tokenOrExpiredAt === "string") {
            expirationTime = this.convertToTimestamp(tokenOrExpiredAt);
        } else {
            expirationTime = this.convertToTimestamp(tokenOrExpiredAt.accessTokenExpiredAt);
        }

        return expirationTime > new Date().getTime();
    }

    private static convertToTimestamp(data: string): number {
        return new Date(data).getTime();
    }
}
