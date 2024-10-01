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
    private static _baseUrl: string | null = null;

    /*
     * get baseUrl of the axios client
     */
    public static get baseUrl(): string | null {
        return Feedboard._baseUrl;
    }

    /*
     * Initializes the axios client for the Feedboard API.
     * @param baseUrl The base URL to set.
     */
    public static init(baseURL: string): void {
        Feedboard._baseUrl = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;

        Feedboard._client = axios.create({
            baseURL: Feedboard._baseUrl,
        });
    }

    /*
     * Update baseUrl of the axios client
     * @param baseUrl The base URL to set.
     */
    public static updateBaseUrl(baseURL: string): void {
        Feedboard.init(baseURL);
    }

    /*
     * Retrieves the login URL for Azure authentication.
     * @returns A promise that resolves to the Azure login URL.
     */
    public static async getAzureLoginURI(): Promise<AxiosResponse<TURLResponse>> {
        Feedboard._checkClient();

        return await axios.get('/auth/azure/login-url');
    }

    /*
     * Processes the Azure OAuth code to retrieve an access token.
     * @param code The OAuth code returned by Azure.
     * @param state The state parameter to validate response from Azure.
     * @returns A promise that resolves to the Azure token response.
     */
    public static async getAzureToken(code: string, state: string): Promise<AxiosResponse<TAzureTokenResponseDto>> {
        Feedboard._checkClient();

        return await axios.get('/auth/azure/callback', {
            params: { code, state },
        });
    }

    /*
     * Updates the Azure access token using a refresh token.
     * @param refreshToken The refresh token to update the access token.
     * @returns A promise that resolves to the Azure token response.
     */
    public static async updateAzureAccessToken(refreshToken: string): Promise<AxiosResponse<TAzureTokenResponseDto>> {
        Feedboard._checkClient();

        return await axios.get('/auth/azure/refresh', {
            params: { refreshToken },
        });
    }

    /*
     * Retrieves the login URL for GitHub authentication.
     * @returns A promise that resolves to the GitHub login URL.
     */
    public static async getGitHubLoginURI(): Promise<AxiosResponse<TURLResponse>> {
        Feedboard._checkClient();

        return await axios.get('/auth/github/login-url');
    }

    /*
     * Retrieves a GitHub access token using the provided code.
     * @param code The code returned by GitHub after user authorization.
     * @returns A promise that resolves to the GitHub token response.
     */
    public static async getGitHubAccessToken(code: string): Promise<AxiosResponse<TGithubTokenResponseDto>> {
        Feedboard._checkClient();

        return await Feedboard._client.get('/auth/github/callback', {
            params: { code },
        });
    }

    /*
     * Checks if the base URI has been set and throws an error if not.
     */
    private static _checkClient(): void {
        if (Feedboard._client === null) {
            throw new Error('Please initialize it first.');
        }
    }
}
