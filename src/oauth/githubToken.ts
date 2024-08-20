import { IToken, TGithubTokenResponseDto } from '../types';

export class GithubToken implements IToken<GithubToken, TGithubTokenResponseDto>{
    private static _token: TGithubTokenResponseDto | null = null;
    private static _isLogged: boolean = false;

    constructor();
    constructor(token: TGithubTokenResponseDto);
    constructor(token?: TGithubTokenResponseDto) {
        if (token) {
            this.addTokenOrUpdate(token);
        }
    }

    public isLogged(): boolean {
        return GithubToken._isLogged;
    }

    public getActiveToken(): GithubToken {
        // TODO validate token
        return this;
    }

    public getActiveTokenAsResponseDto(): TGithubTokenResponseDto | null {
        // TODO validate token
        return GithubToken._token;
    }

    public addTokenOrUpdate(token: TGithubTokenResponseDto): GithubToken {
        // TODO validate token

        GithubToken._token = token;
        GithubToken._isLogged = true;

        return this.getActiveToken();
    }
}
