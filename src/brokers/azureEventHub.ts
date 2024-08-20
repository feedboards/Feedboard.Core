import {
    EventHubConsumerClient,
    ProcessErrorHandler,
    ProcessEventsHandler,
    Subscription,
    earliestEventPosition,
} from '@azure/event-hubs';
import { AuthorizationRule } from '@azure/arm-eventhub';
import { TokenCredential } from '@azure/identity';
import { AzureClient } from '../clients';
import { TEventHub, TEventHubConnectionString, TEventHubOAuth } from '../types';

export class AzureEventHub {
    private _client: EventHubConsumerClient;
    private _eventHub: TEventHub;
    private _subscription: Subscription | undefined;
    private _isMonitoring: boolean = false;

    public isMonitoring(): boolean {
        return this._isMonitoring;
    }

    public getEventHubData(): TEventHub {
        return this._eventHub;
    }

    public updateOrAddEventHubData(eventHub: TEventHub): void {
        this._eventHub = eventHub;
    }

    public startMonitoringByConnectionString(
        eventHub: TEventHubConnectionString,
        processEvents: ProcessEventsHandler,
        processError?: ProcessErrorHandler
    ): void {
        this._client = new EventHubConsumerClient(
            eventHub.consumerGroupName,
            eventHub.connectionString,
            eventHub.eventHubName
        );

        this.updateOrAddEventHubData(eventHub);
        this._startMonitoring(processEvents, processError);
    }

    public async startMonitoringByOAuth(
        eventHub: TEventHubOAuth,
        credential: TokenCredential,
        processEvents: ProcessEventsHandler,
        processError?: ProcessErrorHandler
    ): Promise<void> {
        const azureClient: AzureClient = new AzureClient(credential);
        const rules: AuthorizationRule[] = await azureClient.getAuthorizationRules(
            eventHub.subscriptionId,
            eventHub.resourceGroupName,
            eventHub.namespaceName
        );

        if (!rules) {
            return;
        }

        // TODO get Rule name from args or something like that
        const defaultRule: AuthorizationRule = rules.find((x) => x.name === 'RootManageSharedAccessKey');

        if (!defaultRule) {
            return;
        }

        const key = await azureClient.getKeys(
            eventHub.subscriptionId,
            eventHub.resourceGroupName,
            eventHub.namespaceName,
            defaultRule.name
        );

        if (!key || !key.primaryConnectionString) {
            return;
        }

        this._client = new EventHubConsumerClient(
            eventHub.consumerGroupName,
            key.primaryConnectionString,
            eventHub.eventHubName
        );

        this.updateOrAddEventHubData(eventHub);
        this._startMonitoring(processEvents, processError);
    }

    public async stopMonitoring(): Promise<void> {
        if (this._subscription) {
            await this._subscription.close();
            this._isMonitoring = false;
        }
    }

    public async closeClient(): Promise<void> {
        if (this._client) {
            await this._client.close();
            this._isMonitoring = false;
        }
    }

    private _startMonitoring(processEvents: ProcessEventsHandler, processError?: ProcessErrorHandler): void {
        if (this._isMonitoring) {
            console.log('Monitoring is already active.');

            return;
        }

        this._isMonitoring = true;

        try {
            const handleError =
                processError ||
                ((error, context) => {
                    return Promise.resolve();
                });

            this._subscription = this._client.subscribe(
                {
                    processEvents: (events, context) => {
                        console.log(`Processing event at ${new Date().toISOString()}: `, events);
                        return processEvents(events, context);
                    },
                    processError: handleError,
                },
                { startPosition: earliestEventPosition }
            );
        } catch (error) {
            throw error;
        }
    }
}
