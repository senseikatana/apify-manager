import type { Request, Response } from "express";
/**
 * Get all products.
 *
 * @param _request - Express request (unused)
 * @param response - Express response
 *
 * @example
 * ```ts
 * router.get("/products", useExpressGetAllProducts);
 * // GET /products → [{ id: 1, name: "Widget", price: 9.99 }]
 * ```
 */
export declare const useExpressGetAllProducts: (_request: Request, response: Response) => void;
/**
 * Get a product by ID.
 *
 * @param request - Express request with `id` param
 * @param response - Express response
 *
 * @example
 * ```ts
 * router.get("/products/:id", useExpressGetProductById);
 * // GET /products/1 → { productById: { id: 1, name: "Widget", price: 9.99 } }
 * ```
 */
export declare const useExpressGetProductById: (request: Request, response: Response) => void;
/**
 * Create a new product.
 *
 * @param request - Express request with `name` and `price` in body
 * @param response - Express response
 *
 * @example
 * ```ts
 * router.post("/products", useExpressCreateProduct);
 * // POST /products { name: "Gadget", price: 19.99 }
 * // → { id: 1, name: "Gadget", price: 19.99 }
 * ```
 */
export declare const useExpressCreateProduct: (request: Request, response: Response) => void;
/**
 * Update an existing product by ID.
 *
 * @param request - Express request with `id` param and body fields
 * @param response - Express response
 *
 * @example
 * ```ts
 * router.put("/products/:id", useExpressUpdateProduct);
 * // PUT /products/1 { name: "Updated Widget" }
 * // → { id: 1, name: "Updated Widget", price: 9.99 }
 * ```
 */
export declare const useExpressUpdateProduct: (request: Request, response: Response) => void;
/**
 * Delete a product by ID.
 *
 * @param request - Express request with `id` param
 * @param response - Express response
 *
 * @example
 * ```ts
 * router.delete("/products/:id", useExpressDeleteProduct);
 * // DELETE /products/1 → 204 No Content
 * ```
 */
export declare const useExpressDeleteProduct: (request: Request, response: Response) => void;
//# sourceMappingURL=products.controller.d.ts.map