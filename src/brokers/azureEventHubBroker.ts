import {
    EventHubConsumerClient,
    ProcessErrorHandler,
    ProcessEventsHandler,
    Subscription,
    earliestEventPosition,
} from '@azure/event-hubs';
import { AuthorizationRule } from '@azure/arm-eventhub';
import { AzureClient } from '../clients';
import {
    TEventHub,
    TStartMonitoringByConnectionString,
    TStartMonitoringByOAuth,
} from '../types';

export class AzureEventHubBroker {
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

    public startMonitoringByConnectionString(obj: TStartMonitoringByConnectionString): void {
        this._client = new EventHubConsumerClient(
            obj.eventHub.consumerGroupName,
            obj.eventHub.connectionString,
            obj.eventHub.eventHubName
        );

        this.updateOrAddEventHubData(obj.eventHub);
        this._startMonitoring(obj.processEvents, obj.processError);
    }

    public async startMonitoringByOAuth(obj: TStartMonitoringByOAuth): Promise<void> {
        const azureClient: AzureClient = new AzureClient(obj.credential);
        const rules: AuthorizationRule[] = await azureClient.getAuthorizationRules(
            obj.eventHub.subscriptionId,
            obj.eventHub.resourceGroupName,
            obj.eventHub.namespaceName
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
            obj.eventHub.subscriptionId,
            obj.eventHub.resourceGroupName,
            obj.eventHub.namespaceName,
            defaultRule.name
        );

        if (!key || !key.primaryConnectionString) {
            return;
        }

        this._client = new EventHubConsumerClient(
            obj.eventHub.consumerGroupName,
            key.primaryConnectionString,
            obj.eventHub.eventHubName
        );

        this.updateOrAddEventHubData(obj.eventHub);
        this._startMonitoring(obj.processEvents, obj.processError);
    }

    public async stopMonitoring(): Promise<void> {
        if (this._subscription && this._isMonitoring) {
            await this._subscription.close();

            this._isMonitoring = false;
        }
    }

    public async closeClient(): Promise<void> {
        if (this._client) {
            if (this._isMonitoring) {
                await this.stopMonitoring();
            }

            await this._client.close();
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
                    processEvents,
                    processError: handleError,
                },
                { startPosition: earliestEventPosition }
            );
        } catch (error) {
            throw error;
        }
    }
}
