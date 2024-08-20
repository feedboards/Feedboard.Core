import { AccessToken, GetTokenOptions } from '@azure/identity';
import { TokenCredential } from '@azure/core-auth';
import { IToken, TAzureTokenResponseDto } from '../types';

export class AzureToken implements TokenCredential, IToken<AzureToken, TAzureTokenResponseDto> {
    private static _token: TAzureTokenResponseDto | null = null;
    private static _isLogged: boolean = false;

    constructor();
    constructor(token: TAzureTokenResponseDto);
    constructor(token?: TAzureTokenResponseDto) {
        if (token) {
            this.addTokenOrUpdate(token);
        }
    }

    /*
     * To get AzureToken instance use getActiveToken()
     * @returns AccessToken (not AzureToken instance)
     */
    public async getToken(
        scopes: string | string[],
        options?: GetTokenOptions | undefined
    ): Promise<AccessToken | null> {
        if (AzureToken._token === null || !AzureToken._validateToken(AzureToken._token)) {
            throw new Error('Token is expired or invalid. Please refresh the token.');
        }

        return {
            token: AzureToken._token.accessToken,
            expiresOnTimestamp: AzureToken._convertToTimestamp(AzureToken._token.accessTokenExpiredAt),
        };
    }

    public isLogged(): boolean {
        return AzureToken._isLogged;
    }

    public getActiveToken(): AzureToken {
        if (AzureToken._token === null || !AzureToken._validateToken(AzureToken._token)) {
            throw new Error('Token is expired or invalid. Please refresh the token.');
        }

        return this;
    }

    public getActiveTokenAsResponseDto(): TAzureTokenResponseDto {
        if (AzureToken._token === null || !AzureToken._validateToken(AzureToken._token)) {
            throw new Error('Token is expired or invalid. Please refresh the token.');
        }

        return AzureToken._token;
    }

    public addTokenOrUpdate(token: TAzureTokenResponseDto): AzureToken {
        if (AzureToken._validateToken(token)) {
            throw new Error('Token is expired or invalid. Please refresh the token.');
        }

        AzureToken._token = token;
        AzureToken._isLogged = true;

        return this.getActiveToken();
    }

    private static _validateToken(tokenOrExpiredAt: TAzureTokenResponseDto | string | number): boolean {
        let expirationTime: number;

        if (typeof tokenOrExpiredAt === 'number') {
            expirationTime = tokenOrExpiredAt;
        } else if (typeof tokenOrExpiredAt === 'string') {
            expirationTime = this._convertToTimestamp(tokenOrExpiredAt);
        } else {
            expirationTime = this._convertToTimestamp(tokenOrExpiredAt.accessTokenExpiredAt);
        }

        return expirationTime > new Date().getTime();
    }

    private static _convertToTimestamp(data: string): number {
        return new Date(data).getTime();
    }
}
