export type TConnection = {
    id: string;
    name: string;
    settings: TConnectionSettingsAzureConnectionString | TConnectionSettingsAzureOAuth | TConnectionMQTT;
};

type TBaseConnection = {
    loginType: ELoginType;
}

export type TConnectionSettingsAzureConnectionString = TBaseConnection & {
    connectionString: string;
};

export type TConnectionSettingsAzureOAuth = TBaseConnection & {
    subscription: TSubscription;
    resourceGroup: TData;
    namespace: TData;
    eventHub: TData;
    consumerGroup: TData;
};

export type TConnectionMQTT = TBaseConnection & {
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
