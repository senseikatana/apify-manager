import { useLogger } from "../../core/services/logger.service.js";

import type { BatteryManager, GeoPosition } from "../../types/index.js";

/**
 * Device sensors and hardware APIs: camera, microphone, geolocation,
 * gyroscope and vibration.
 */
export class SensorsUtils {
	private static instance: SensorsUtils;

	private constructor() {}

	static getInstance(): SensorsUtils {
		if (!SensorsUtils.instance) {
			SensorsUtils.instance = new SensorsUtils();
		}
		return SensorsUtils.instance;
	}

	private isBrowser(): boolean {
		return typeof window !== "undefined" && typeof navigator !== "undefined";
	}

	async useGetMediaStream(
		constraints: MediaStreamConstraints = { video: true, audio: true },
	): Promise<MediaStream | null> {
		if (!this.isBrowser() || !navigator.mediaDevices?.getUserMedia) {
			useLogger("[getMediaStream] API not supported in this environment.", "warn");
			return null;
		}

		try {
			return await navigator.mediaDevices.getUserMedia(constraints);
		} catch (error) {
			useLogger("[getMediaStream] Permission denied or error:", error, "error");
			return null;
		}
	}

	useStopMediaStream(stream: MediaStream | null): void {
		if (stream) {
			for (const track of stream.getTracks()) {
				track.stop();
			}
		}
	}

	async useGetFrontCamera(): Promise<MediaStream | null> {
		return this.useGetMediaStream({ video: { facingMode: "user" }, audio: false });
	}

	async useGetBackCamera(): Promise<MediaStream | null> {
		return this.useGetMediaStream({ video: { facingMode: "environment" }, audio: false });
	}

	async useGetGeolocation(options?: PositionOptions): Promise<GeoPosition | null> {
		if (!this.isBrowser() || !navigator.geolocation) return null;

		return new Promise((resolve) => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
						accuracy: position.coords.accuracy,
					});
				},
				(error) => {
					useLogger("[getGeolocation] Error:", error.message, "error");
					resolve(null);
				},
				{ enableHighAccuracy: true, timeout: 10000, ...options },
			);
		});
	}

	useWatchGeolocation(
		callback: (position: GeoPosition) => void,
		options?: PositionOptions,
	): (() => void) | null {
		if (!this.isBrowser() || !navigator.geolocation) return null;

		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				callback({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					accuracy: position.coords.accuracy,
				});
			},
			(error) => {
				useLogger("[watchGeolocation] Error:", error.message, "error");
			},
			{ enableHighAccuracy: true, ...options },
		);

		return () => navigator.geolocation.clearWatch(watchId);
	}

	async useRequestMotionPermission(): Promise<boolean> {
		if (!this.isBrowser()) return false;

		if (typeof DeviceOrientationEvent === "undefined") {
			return false;
		}

		const DeviceOrientationEventExtended = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
			requestPermission?: () => Promise<string>;
		};

		if (typeof DeviceOrientationEventExtended.requestPermission === "function") {
			try {
				const response = await DeviceOrientationEventExtended.requestPermission();
				return response === "granted";
			} catch (error) {
				useLogger("[requestMotionPermission] Error:", error, "error");
				return false;
			}
		}

		return true;
	}

	useOnDeviceOrientation(callback: (event: DeviceOrientationEvent) => void): (() => void) | null {
		if (!this.isBrowser() || typeof DeviceOrientationEvent === "undefined") return null;

		window.addEventListener("deviceorientation", callback);

		return () => {
			window.removeEventListener("deviceorientation", callback);
		};
	}

	useOnDeviceMotion(callback: (event: DeviceMotionEvent) => void): (() => void) | null {
		if (!this.isBrowser()) return null;

		window.addEventListener("devicemotion", callback);

		return () => {
			window.removeEventListener("devicemotion", callback);
		};
	}

	useVibrate(pattern: number | number[]): boolean {
		if (this.isBrowser() && "vibrate" in navigator) {
			return navigator.vibrate(pattern);
		}
		return false;
	}

	useStopVibration(): boolean {
		return this.useVibrate(0);
	}

	async useGetBattery(): Promise<BatteryManager | null> {
		if (!this.isBrowser()) return null;

		const nav = navigator as Navigator & {
			getBattery?: () => Promise<BatteryManager>;
		};

		if (!nav.getBattery) return null;

		try {
			return await nav.getBattery();
		} catch (error) {
			useLogger("[getBattery] Error:", error, "error");
			return null;
		}
	}
}

// Singleton instance export.
export const sensorsUtils = SensorsUtils.getInstance();
