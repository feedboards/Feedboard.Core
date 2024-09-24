export type TMqttStartMonitoring = {
    host: string;
    topic?: string;
    processMessage: (topic: string, message: Buffer) => void
};