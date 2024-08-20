import { TAzureTokenResponseDto, TGithubTokenResponseDto, TURLResponse } from '../types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

/*
 * Class Feedboard manages interactions with the Feedboard API.
 * Make sure to initialize it with the base URI before using any methods.
 *
 * TODO: Add link to documentation on how to install Feedboard API in Docker.
 */
export class Feedboard {
    private static _client: AxiosInstance | null = null;

    /*
     * Initializes the axios client for the Feedboard API.
     * @param baseUri The base URL to set.
     */
    public static init(baseURL: string) {
        this._client = axios.create({
            baseURL,
        });
    }

    /*
     * Retrieves the login URL for Azure authentication.
     * @returns A promise that resolves to the Azure login URL.
     */
    public static async getAzureLoginURI(): Promise<AxiosResponse<TURLResponse>> {
        this._checkClient();

        return await axios.get('/AzureOAuth/login-url');
    }

    /*
     * Processes the Azure OAuth code to retrieve an access token.
     * @param code The OAuth code returned by Azure.
     * @param state The state parameter to validate response from Azure.
     * @returns A promise that resolves to the Azure token response.
     */
    public static async getAzureToken(code: string, state: string): Promise<AxiosResponse<TAzureTokenResponseDto>> {
        this._checkClient();

        return await axios.get('/AzureOAuth/process-code', {
            params: { code, state },
        });
    }

    /*
     * Updates the Azure access token using a refresh token.
     * @param refreshToken The refresh token to update the access token.
     * @returns A promise that resolves to the Azure token response.
     */
    public static async updateAzureAccessToken(refreshToken: string): Promise<AxiosResponse<TAzureTokenResponseDto>> {
        this._checkClient();

        return await axios.get('/AzureOAuth/update-access-token', {
            params: { refreshToken },
        });
    }

    /*
     * Retrieves the login URL for GitHub authentication.
     * @returns A promise that resolves to the GitHub login URL.
     */
    public static async getGitHubLoginURI(): Promise<AxiosResponse<TURLResponse>> {
        this._checkClient();

        return await axios.get('/GitHubOauth/login');
    }

    /*
     * Retrieves a GitHub access token using the provided code.
     * @param code The code returned by GitHub after user authorization.
     * @returns A promise that resolves to the GitHub token response.
     */
    public static async getGitHubAccessToken(code: string): Promise<AxiosResponse<TGithubTokenResponseDto>> {
        this._checkClient();

        return await this._client.get('/GitHubOauth/callback', {
            params: { code },
        });
    }

    /*
     * Checks if the base URI has been set and throws an error if not.
     */
    private static _checkClient(): void {
        if (this._client === null) {
            throw new Error('Please initialize it first.');
        }
    }
}
