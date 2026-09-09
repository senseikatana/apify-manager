/** Module-level products storage. */
const products = [];
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
export const useExpressGetAllProducts = (_request, response) => {
    response.json(products);
};
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
export const useExpressGetProductById = (request, response) => {
    const id = Number.parseInt(String(request.params.id), 10);
    const product = products.find((item) => item.id === id);
    if (!product) {
        response.status(404).json({ error: "Product not found" });
        return;
    }
    response.json({ productById: product });
};
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
export const useExpressCreateProduct = (request, response) => {
    const { name = "", price = 0 } = (request.body ?? {});
    const product = {
        id: products.length + 1,
        name,
        price: Number(price),
    };
    products.push(product);
    response.status(201).json(product);
};
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
export const useExpressUpdateProduct = (request, response) => {
    const id = Number.parseInt(String(request.params.id), 10);
    const product = products.find((item) => item.id === id);
    if (!product) {
        response.status(404).json({ error: "Product not found" });
        return;
    }
    const { name, price } = (request.body ?? {});
    product.name = name ?? product.name;
    product.price = Number(price ?? product.price);
    response.json(product);
};
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
export const useExpressDeleteProduct = (request, response) => {
    const id = Number.parseInt(String(request.params.id), 10);
    const index = products.findIndex((item) => item.id === id);
    if (index === -1) {
        response.status(404).json({ error: "Product not found" });
        return;
    }
    products.splice(index, 1);
    response.status(204).send();
};
//# sourceMappingURL=products.controller.js.map