import {
    TConnectionMQTT,
    TConnectionSettingsAzureConnectionString,
    TConnectionSettingsAzureOAuth,
} from '../types';

export const isTConnectionSettingsAzureOAuth = (obj: any): obj is TConnectionSettingsAzureOAuth => {
    return obj && typeof obj === 'object' && 'subscription' in obj;
};

export const isTConnectionSettingsAzureConnectionString = (obj: any): obj is TConnectionSettingsAzureConnectionString => {
    return obj && typeof obj === 'object' && 'connectionString' in obj;
};

export const isTConnectionMQTT = (obj: any): obj is TConnectionMQTT => {
    return obj && typeof obj === 'object' && 'host' in obj;
}