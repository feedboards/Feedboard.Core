type TBaseEventHub = {
    consumerGroupName: string;
    eventHubName: string;
}

export type TEventHubConnectionString = TBaseEventHub & {
    connectionString: string;
}

export type TEventHubOAuth = TBaseEventHub & {
    subscriptionId: string;
    resourceGroupName: string;
    namespaceName: string;
}

export type TEventHub = TEventHubConnectionString | TEventHubOAuth;
