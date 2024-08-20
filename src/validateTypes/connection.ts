import {
    ELoginType,
    TConnectionSettingsAzureConnectionString,
    TConnectionSettingsAzureOAuth,
} from '../types/connection';

export const isTConnectionSettingsAzureOAuth = (obj: any): obj is TConnectionSettingsAzureOAuth => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.azureOAuth;
};

export const isTConnectionSettingsAzureConnectionString = (obj: any): obj is TConnectionSettingsAzureConnectionString => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.connectionString;
};
