export interface GPSPosition {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number;
    timestamp: number;
}

export interface ModelPosition {
    x: number;
    y: number;
    z: number;
}

export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export class GeolocationService {
    private watchId: number | null = null;
    private lastPosition: GPSPosition | null = null;
    private listeners: Set<(position: GPSPosition, error?: string) => void> = new Set();

    async getCurrentPosition(options?: GeolocationOptions): Promise<GPSPosition> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            const defaultOptions: GeolocationOptions = {
                enableHighAccuracy: true,
                timeout: options?.timeout ?? 10000,
                maximumAge: options?.maximumAge ?? 0,
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const gpsPosition: GPSPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        altitude: position.coords.altitude ?? undefined,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    };
                    this.lastPosition = gpsPosition;
                    resolve(gpsPosition);
                },
                (error) => {
                    let errorMessage: string;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                        default:
                            errorMessage = 'Unknown geolocation error';
                    }
                    reject(new Error(errorMessage));
                },
                defaultOptions as PositionOptions
            );
        });
    }

    watchPosition(
        onUpdate: (position: GPSPosition) => void,
        onError?: (error: string) => void,
        options?: GeolocationOptions
    ): number {
        if (!navigator.geolocation) {
            onError?.('Geolocation is not supported by this browser');
            return -1;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const gpsPosition: GPSPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    altitude: position.coords.altitude ?? undefined,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                };
                this.lastPosition = gpsPosition;
                onUpdate(gpsPosition);
                this.listeners.forEach(listener => listener(gpsPosition));
            },
            (error) => {
                let errorMessage: string;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'Unknown geolocation error';
                }
                onError?.(errorMessage);
                this.listeners.forEach(listener => listener(this.lastPosition!, errorMessage));
            },
            {
                enableHighAccuracy: options?.enableHighAccuracy ?? true,
                timeout: options?.timeout ?? 10000,
                maximumAge: options?.maximumAge ?? 5000,
            }
        );

        this.watchId = watchId;
        return watchId;
    }

    stopWatching(): void {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    subscribe(listener: (position: GPSPosition, error?: string) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    getLastKnownPosition(): GPSPosition | null {
        return this.lastPosition;
    }

    isSupported(): boolean {
        return !!navigator.geolocation;
    }
}

export const geolocationService = new GeolocationService();