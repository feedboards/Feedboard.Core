export type TConnection = {
    id: string;
    name: string;
    settings: TConnectionSettingsAzureConnectionString | TConnectionSettingsAzureOAuth | TConnectionMQTT;
};

export type TConnectionSettingsAzure = {
    loginType: ELoginType;
};

export type TConnectionSettingsAzureConnectionString = TConnectionSettingsAzure & {
    connectionString: string;
};

export type TConnectionSettingsAzureOAuth = TConnectionSettingsAzure & {
    subscription: TSubscription;
    resourceGroup: TData;
    namespace: TData;
    eventHub: TData;
    consumerGroup: TData;
};

export type TConnectionMQTT = {
    host: string;
    topic?: string;
};

type TSubscription = {
    readonly subscriptionId?: string;
    readonly displayName?: string;
    readonly tenantId?: string;
};

type TData = {
    readonly id?: string;
    readonly name?: string;
};

export enum ELoginType {
    azureOAuth = 'azureOAuth',
    connectionString = 'connectionString',
    mqtt = 'mqtt',
}
