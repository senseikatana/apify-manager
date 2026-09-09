import type { BatteryManager, GeoPosition } from "../../types/index.js";
/**
 * Requests a media stream (camera, microphone, or both).
 *
 * @param constraints - MediaStream constraints (default: video + audio).
 * @returns A `MediaStream` or `null` if the API is unavailable or permission is denied.
 *
 * @example
 * ```ts
 * const stream = await useGetMediaStream({ video: true, audio: false });
 * if (stream) {
 *   videoElement.srcObject = stream;
 * }
 * ```
 */
export declare function useGetMediaStream(constraints?: MediaStreamConstraints): Promise<MediaStream | null>;
/**
 * Stops all tracks in a media stream (releases camera/microphone).
 *
 * @param stream - The MediaStream to stop, or `null`.
 *
 * @example
 * ```ts
 * const stream = await useGetMediaStream();
 * // ... use stream ...
 * useStopMediaStream(stream);
 * ```
 */
export declare function useStopMediaStream(stream: MediaStream | null): void;
/**
 * Opens the front-facing (user) camera.
 *
 * @returns A video-only `MediaStream` or `null`.
 *
 * @example
 * ```ts
 * const selfieStream = await useGetFrontCamera();
 * ```
 */
export declare function useGetFrontCamera(): Promise<MediaStream | null>;
/**
 * Opens the back-facing (environment) camera.
 *
 * @returns A video-only `MediaStream` or `null`.
 *
 * @example
 * ```ts
 * const rearStream = await useGetBackCamera();
 * ```
 */
export declare function useGetBackCamera(): Promise<MediaStream | null>;
/**
 * Gets the device's current geographic position once.
 *
 * @param options - Optional PositionOptions to override defaults.
 * @returns A {@link GeoPosition} object or `null` on error / unavailability.
 *
 * @example
 * ```ts
 * const pos = await useGetGeolocation({ enableHighAccuracy: true });
 * if (pos) console.log(`${pos.lat}, ${pos.lng}`);
 * ```
 */
export declare function useGetGeolocation(options?: PositionOptions): Promise<GeoPosition | null>;
/**
 * Continuously watches the device's geographic position.
 *
 * @param callback - Called with a {@link GeoPosition} on each position update.
 * @param options - Optional PositionOptions to override defaults.
 * @returns A cleanup function that stops watching, or `null` if unavailable.
 *
 * @example
 * ```ts
 * const stop = useWatchGeolocation((pos) => {
 *   console.log("Moved to", pos.lat, pos.lng);
 * });
 * // later:
 * stop?.();
 * ```
 */
export declare function useWatchGeolocation(callback: (position: GeoPosition) => void, options?: PositionOptions): (() => void) | null;
/**
 * Requests permission to access device orientation/motion sensors (required on iOS 13+).
 *
 * @returns `true` if permission is granted or already available, `false` otherwise.
 *
 * @example
 * ```ts
 * const granted = await useRequestMotionPermission();
 * if (granted) {
 *   useOnDeviceOrientation((e) => console.log(e.alpha, e.beta));
 * }
 * ```
 */
export declare function useRequestMotionPermission(): Promise<boolean>;
/**
 * Listens for device orientation events (compass heading, tilt).
 *
 * @param callback - Called with each `DeviceOrientationEvent`.
 * @returns A cleanup function that removes the listener, or `null` if unavailable.
 *
 * @example
 * ```ts
 * const off = useOnDeviceOrientation((e) => {
 *   console.log("Alpha:", e.alpha);
 * });
 * ```
 */
export declare function useOnDeviceOrientation(callback: (event: DeviceOrientationEvent) => void): (() => void) | null;
/**
 * Listens for device motion events (acceleration, rotation rate).
 *
 * @param callback - Called with each `DeviceMotionEvent`.
 * @returns A cleanup function that removes the listener, or `null` if unavailable.
 *
 * @example
 * ```ts
 * const off = useOnDeviceMotion((e) => {
 *   console.log("Acceleration:", e.acceleration);
 * });
 * ```
 */
export declare function useOnDeviceMotion(callback: (event: DeviceMotionEvent) => void): (() => void) | null;
/**
 * Triggers the device vibration motor with a given pattern.
 *
 * @param pattern - A single duration (ms) or an array of vibrate/pause durations.
 * @returns `true` if vibration was triggered, `false` otherwise.
 *
 * @example
 * ```ts
 * useVibrate(200);           // vibrate 200 ms
 * useVibrate([100, 50, 100]); // vibrate, pause, vibrate
 * ```
 */
export declare function useVibrate(pattern: number | number[]): boolean;
/**
 * Stops any ongoing vibration.
 *
 * @returns `true` if the call succeeded.
 */
export declare function useStopVibration(): boolean;
/**
 * Gets the device battery status.
 *
 * @returns A `BatteryManager` object or `null` if the API is unavailable.
 *
 * @example
 * ```ts
 * const battery = await useGetBattery();
 * if (battery) {
 *   console.log(`${Math.round(battery.level * 100)}%`);
 * }
 * ```
 */
export declare function useGetBattery(): Promise<BatteryManager | null>;
//# sourceMappingURL=sensors.service.d.ts.map