import { ProcessErrorHandler, ProcessEventsHandler } from '@azure/event-hubs';
import { TokenCredential } from '@azure/identity';

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

type TStartMonitoring = {
    processEvents: ProcessEventsHandler;
    processError?: ProcessErrorHandler;
}

export type TStartMonitoringByConnectionString = TStartMonitoring & {
    eventHub: TEventHubConnectionString,
}

export type TStartMonitoringByOAuth = TStartMonitoring & {
    eventHub: TEventHubOAuth;
    credential: TokenCredential;
}