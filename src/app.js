import express from 'express';
import { ProductManager } from "./ProductManager.js";

const manager = new ProductManager('Productos.json');

const port = 8080;
const app = express();
app.use(express.urlencoded({extended: true}));
app.listen(port, () => console.log(`Servidor inicializado en el puerto ${ port }`));

const operaciones = async () => {

    app.get("/products", async (req, res) => {
        try {
            const limit = req.query.limit;

            const productos = await manager.getProducts();

            if (limit != undefined) {
                res.send(productos.slice(0, limit));
            }
            else {
                res.send(productos);
            }
        }
        catch (error) {
            console.log(`Error buscando productos: ${ error.message }`);
        }
    });

    app.get("/products/:pid", async (req, res) => {
        try {
            const productos = await manager.getProducts();
            const pid = parseInt(req.params.pid);
            const producto = productos.find(prod => prod.id === pid);

            if (!producto) {
                res.send("Producto no encontrado.");
            }
            else {
                res.send(producto);
            }
        }
        catch (error) {
            console.log(`Error buscando producto: ${ error.message }`);
        }
    });
}

operaciones();
