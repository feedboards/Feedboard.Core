import mqtt, { MqttClient } from 'mqtt';
import { TMqttStartMonitoring } from '../types';

export class MqttBroker {
    private _client: MqttClient;
    private _isMonitoring: boolean = false;

    public isMonitoring(): boolean {
        return this._isMonitoring;
    }

    public startMonitoring(obj: TMqttStartMonitoring): void{
        this._client = mqtt.connect(obj.host);

        this._client.on("connect", () => {
            this._client.subscribe(obj.topic !== undefined ? obj.topic : "#", (error) => {
                if (error) {
                    this.stopMonitoring();

                    return;
                }

                this._isMonitoring = true;
            })
        });

        this._client.on("message", (topic, message) => {
            obj.processMessage(topic, message);
        })

        this._client.on("disconnect", () => {
           this._isMonitoring = false;
        });
    }

    public stopMonitoring(): void {
        if (this._client && this._isMonitoring) {
            this._client.end();

            this._isMonitoring = false;
        }
    }
}