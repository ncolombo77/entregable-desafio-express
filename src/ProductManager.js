import fs from "fs";

class ProductManager {

    constructor(path) {
        this.path = path;
    }


    async addProduct(producto) {
        try {
            let productos = await this.getProducts();

            if (productos.length > 0) {
                if (productos.some((prod) => { return prod.code === producto.code })) {
                    return console.log("Ya existe un producto con el código indicado.");
                }

                producto.setId(Math.max(...productos.map((obj) => { return obj.id; })) + 1);
            }
            else {
                producto.setId(1);
            }

            if (producto.title === "" || producto.description === "" || producto.price === 0
                || producto.thumbnail === "" || producto.code === "" || producto.stock === 0) {
                return console.log("Faltan datos en el producto.")
            }

            productos.push(producto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
        }
        catch (error) {
            console.log(`Error agregando producto ${ producto.id }: ${error.message}`);
        }
    }


    fileExists() {
        return fs.existsSync(this.path);
    };


    async getProducts() {
        try {
            if (this.fileExists()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const productos = JSON.parse(contenido);
                return productos;
            }
            else {
                console.log("El archivo no existe.");
                return undefined;
            }
        } catch (error) {
            console.log("Error obteniendo productos: ", error.message);
        }
    };


    async getProductById(id) {
        try {
            let productos = await this.getProducts();

            let prod = productos.find((pr) => { return pr.id === id });
            if (prod != undefined) {
                return prod;
            }
            else {
                return console.log("Not found.")
            }
        }
        catch (error) {
            console.log(`Error obteniendo producto ${ id }: ${ error.message}`);
        }
    }


    async deleteProduct(id) {
        try {
            let productos = await this.getProducts();

            let indiceProd = productos.findIndex(prod => prod.id === id);

            if (indiceProd > -1) {
                productos.splice(indiceProd, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
            }
            else {
                return console.log("No se puede eliminar el producto, no existe el id.")
            }
        }
        catch (error) {
            console.log(`Error eliminando producto ${ id }: ${ error.message}`);
        }
    }


    async updateProduct(producto) {
        try {
            let productos = await this.getProducts();

            let indiceProd = productos.findIndex(prod => prod.id === producto.id);

            if (indiceProd > -1) {
                productos[indiceProd].title = producto.title;
                productos[indiceProd].description = producto.description;
                productos[indiceProd].price = producto.price;
                productos[indiceProd].thumbnail = producto.thumbnail;
                productos[indiceProd].code = producto.code;
                productos[indiceProd].stock = producto.stock;
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
            }
            else {
                return console.log("No se puede actualizar el producto, no existe el id.")
            }

            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
        }
        catch (error) {
            console.log(`Error actualizando producto ${producto.id}: ${error.message}`);
        }
    }

}

class producto {

    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = 0;
    }

    setId(id) {
        this.id = id;
    }
}

export { ProductManager, producto };