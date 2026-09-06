import { useLogger } from "../../core/services/logger.service.js";
/**
 * Device sensors and hardware APIs: camera, microphone, geolocation,
 * gyroscope and vibration.
 */
export class SensorsUtils {
    static instance;
    constructor() { }
    static getInstance() {
        if (!SensorsUtils.instance) {
            SensorsUtils.instance = new SensorsUtils();
        }
        return SensorsUtils.instance;
    }
    isBrowser() {
        return typeof window !== "undefined" && typeof navigator !== "undefined";
    }
    async useGetMediaStream(constraints = { video: true, audio: true }) {
        if (!this.isBrowser() || !navigator.mediaDevices?.getUserMedia) {
            useLogger("[getMediaStream] API not supported in this environment.", "warn");
            return null;
        }
        try {
            return await navigator.mediaDevices.getUserMedia(constraints);
        }
        catch (error) {
            useLogger("[getMediaStream] Permission denied or error:", error, "error");
            return null;
        }
    }
    useStopMediaStream(stream) {
        if (stream) {
            for (const track of stream.getTracks()) {
                track.stop();
            }
        }
    }
    async useGetFrontCamera() {
        return this.useGetMediaStream({ video: { facingMode: "user" }, audio: false });
    }
    async useGetBackCamera() {
        return this.useGetMediaStream({ video: { facingMode: "environment" }, audio: false });
    }
    async useGetGeolocation(options) {
        if (!this.isBrowser() || !navigator.geolocation)
            return null;
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            }, (error) => {
                useLogger("[getGeolocation] Error:", error.message, "error");
                resolve(null);
            }, { enableHighAccuracy: true, timeout: 10000, ...options });
        });
    }
    useWatchGeolocation(callback, options) {
        if (!this.isBrowser() || !navigator.geolocation)
            return null;
        const watchId = navigator.geolocation.watchPosition((position) => {
            callback({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
            });
        }, (error) => {
            useLogger("[watchGeolocation] Error:", error.message, "error");
        }, { enableHighAccuracy: true, ...options });
        return () => navigator.geolocation.clearWatch(watchId);
    }
    async useRequestMotionPermission() {
        if (!this.isBrowser())
            return false;
        if (typeof DeviceOrientationEvent === "undefined") {
            return false;
        }
        const DeviceOrientationEventExtended = DeviceOrientationEvent;
        if (typeof DeviceOrientationEventExtended.requestPermission === "function") {
            try {
                const response = await DeviceOrientationEventExtended.requestPermission();
                return response === "granted";
            }
            catch (error) {
                useLogger("[requestMotionPermission] Error:", error, "error");
                return false;
            }
        }
        return true;
    }
    useOnDeviceOrientation(callback) {
        if (!this.isBrowser() || typeof DeviceOrientationEvent === "undefined")
            return null;
        window.addEventListener("deviceorientation", callback);
        return () => {
            window.removeEventListener("deviceorientation", callback);
        };
    }
    useOnDeviceMotion(callback) {
        if (!this.isBrowser())
            return null;
        window.addEventListener("devicemotion", callback);
        return () => {
            window.removeEventListener("devicemotion", callback);
        };
    }
    useVibrate(pattern) {
        if (this.isBrowser() && "vibrate" in navigator) {
            return navigator.vibrate(pattern);
        }
        return false;
    }
    useStopVibration() {
        return this.useVibrate(0);
    }
    async useGetBattery() {
        if (!this.isBrowser())
            return null;
        const nav = navigator;
        if (!nav.getBattery)
            return null;
        try {
            return await nav.getBattery();
        }
        catch (error) {
            useLogger("[getBattery] Error:", error, "error");
            return null;
        }
    }
}
// Singleton instance export.
export const sensorsUtils = SensorsUtils.getInstance();
//# sourceMappingURL=sensors.service.js.map