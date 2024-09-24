export type TConnection = {
    id: string;
    name: string;
    loginType: ELoginType;
    settings: TConnectionSettingsAzureConnectionString | TConnectionSettingsAzureOAuth | TConnectionMQTT;
};

export type TConnectionSettingsAzureConnectionString = {
    connectionString: string;
};

export type TConnectionSettingsAzureOAuth = {
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
