import type { GeometryFormatOptions } from "../../types/index.js";
/**
 * Pure area calculations for geometric shapes (static methods, no instance state).
 */
export declare class GeometryArea {
    private constructor();
    static useRectangle(width: number, height: number, options?: GeometryFormatOptions): string;
    static useSquare(side: number, options?: GeometryFormatOptions): string;
    static useTriangle(base: number, height: number, options?: GeometryFormatOptions): string;
    static useCircle(radius: number, options?: GeometryFormatOptions): string;
    static useTrapezoid(parallelSide1: number, parallelSide2: number, height: number, options?: GeometryFormatOptions): string;
    static useHexagon(side: number, options?: GeometryFormatOptions): string;
    static useEllipse(semiMajor: number, semiMinor: number, options?: GeometryFormatOptions): string;
    static useParallelogram(base: number, height: number, options?: GeometryFormatOptions): string;
}
/**
 * Pure perimeter calculations for geometric shapes (static methods, no instance state).
 */
export declare class GeometryPerimeter {
    private constructor();
    static useRectangle(width: number, height: number, options?: GeometryFormatOptions): string;
    static useSquare(side: number, options?: GeometryFormatOptions): string;
    static useTriangle(side1: number, side2: number, side3: number, options?: GeometryFormatOptions): string;
    static useCircle(radius: number, options?: GeometryFormatOptions): string;
    static useHexagon(side: number, options?: GeometryFormatOptions): string;
    static useTrapezoid(side1: number, side2: number, side3: number, side4: number, options?: GeometryFormatOptions): string;
    static useEllipse(semiMajor: number, semiMinor: number, options?: GeometryFormatOptions): string;
    static useParallelogram(side1: number, side2: number, options?: GeometryFormatOptions): string;
}
/**
 * Pure volume calculations for 3D geometric shapes (static methods, no instance state).
 */
export declare class GeometryVolume {
    private constructor();
    static useCube(side: number, options?: GeometryFormatOptions): string;
    static useBox(length: number, width: number, height: number, options?: GeometryFormatOptions): string;
    static useSphere(radius: number, options?: GeometryFormatOptions): string;
    static useCylinder(radius: number, height: number, options?: GeometryFormatOptions): string;
    static useCone(radius: number, height: number, options?: GeometryFormatOptions): string;
    static usePyramid(baseArea: number, height: number, options?: GeometryFormatOptions): string;
}
/**
 * Consolidated pure geometry utilities namespace.
 * Groups area, perimeter and volume calculations (no shared mutable state).
 */
export declare const GeometryUtils: {
    area: typeof GeometryArea;
    perimeter: typeof GeometryPerimeter;
    volume: typeof GeometryVolume;
};
//# sourceMappingURL=geometry.service.d.ts.map