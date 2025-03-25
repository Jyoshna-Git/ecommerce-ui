import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
 
export default function Product() {
    const [products, setProducts] = useState([]);
    const [editingProduct, seteditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({id:"",name:"",price:""});
    const [open, setOpen] = useState(false);
   
    useEffect(() => {
        fetchproducts();
    }, []);
   
    const fetchproducts = async () => {
    const response = await axios.get("http://localhost:8080/products");
        setProducts(response.data);
    };
   
    const addProduct= async () => {
        if(editingProduct){
        await axios.put(`http://localhost:8080/products/${editingProduct.id}`, newProduct);
        }else{
        await axios.post("http://localhost:8080/products", newProduct);
        }
        fetchproducts();
       handleClose();
    };
   
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/products/${id}`);
        fetchproducts();
    };

    const handleOpen = (product = null) => {
        seteditingProduct(product);
        setNewProduct(product ? product : {id:"",name:"",price:""});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        seteditingProduct(null);
    }
   
    return (
        <>
            <div>
                <h2>List of Products</h2>
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Product</Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Product Price</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleOpen(product)}>Edit</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* For Add/Edit Product */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="id"
                        label="Product ID"
                        type="text"
                        fullWidth
                        value={newProduct.id}
                        onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Product Name"
                        type="text"
                        fullWidth
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Product Price"
                        type="text"
                        fullWidth
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={addProduct} color="primary">{editingProduct ? "Edit" : "Add"}</Button>
                </DialogActions>
            </Dialog>
            </div>
        </>
    );
};