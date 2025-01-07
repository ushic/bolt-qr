export const MQTT_CONFIG = {
  protocol: 'wss',
  defaultPort: 8084,
  keepalive: 30,
  connectTimeout: 5000, // 5 second timeout per attempt
  clean: true,
  reconnectPeriod: 0, // Disable auto-reconnect to handle it manually
  maxRetries: 3
}

export const QOS_LEVELS = [
  { value: 0, label: '0 - At most once' },
  { value: 1, label: '1 - At least once' },
  { value: 2, label: '2 - Exactly once' }
]
