import {
    ELoginType, TConnectionMQTT,
    TConnectionSettingsAzureConnectionString,
    TConnectionSettingsAzureOAuth,
} from '../types';

export const isTConnectionSettingsAzureOAuth = (obj: any): obj is TConnectionSettingsAzureOAuth => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.azureOAuth;
};

export const isTConnectionSettingsAzureConnectionString = (obj: any): obj is TConnectionSettingsAzureConnectionString => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.connectionString;
};

export const isTConnectionMQTT = (obj: any): obj is TConnectionMQTT => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.mqtt;
}