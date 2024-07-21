import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Button } from '@mui/material';
import { useGetShipping } from '../../hooks/shippingFetching';
import { toast } from "react-toastify";
import Toast from "../../components/Toast/Toast";
import { useMutation } from '@tanstack/react-query';
import * as ShippingService from "../../services/Shipping/shippingService"
const StyledSection = styled('section')(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    margin: theme.spacing(4, 0),
    fontSize: '18px',
    '& *': {
        fontSize: '18px',
    }
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    '& *': {
        fontSize: '18px',
    }
}));

const MyOrdersPage = () => {
    const toastId = React.useRef(null);
    const Toastobjects = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };
    const user = useSelector((state) => state.user)
    const getListQuery = useGetShipping(user?.access_token);
    const [open, setOpen] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const {
        data,
        isLoading,
        isError,
    } = getListQuery;

    const { orders } = useSelector((state) => state.user);
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const mutationDelete = useMutation({
        mutationFn: (data) => ShippingService.deleteShipping(data),
        onSuccess: () => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Succes!", Toastobjects);
            }
            window.location.reload();
        },
        onError: (error) => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Error!", Toastobjects);
            }
            // window.location.reload();
        },
    });

    const muationUpdate = useMutation({
        mutationFn: (data) => ShippingService.updateShipping(data),
        onSuccess: () => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.success("Succes!", Toastobjects);
            }
            window.location.reload();
        },
        onError: (error) => {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Error!", Toastobjects);
            }
            // window.location.reload();
        },
    })
    const handleToggle = (id) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [id]: !prevOpen[id]
        }));
    };

    const handleEdit = (order) => {
        if (order.status !== "pending") {
            // toast.error('You cannot change because the order has already been shipped', {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "colored",
            //     transition: Bounce,
            //     className: "custom-toast",
            // });
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("You cannot change because the order has already been shipped!", Toastobjects);
            }
        }
        else {
            setCurrentOrder(order);
            setEditModalOpen(true);
        }
    };

    const handleDelete = (order) => {
        // Logic for deleting order
        if (order.status !== "pending") {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("You cannot change because the order has already been shipped!", Toastobjects);
            }
            return
        }
        mutationDelete.mutate({
            id: order._id,
            access_token: user.access_token
        })
        console.log("Delete order:", order);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setCurrentOrder(null);
    };

    const handleSaveEdit = () => {
        muationUpdate.mutate({
            id: currentOrder._id,
            destination: currentOrder.destination,
            access_token: user.access_token
        })
        // console.log(currentOrder)
        handleCloseEditModal();
    };

    return (
        <>
            <Toast />
            {
                isLoading ? (
                    <div>Loading.......</div>
                ) : (
                    <StyledSection>
                        <Typography variant="h4" component="h1" gutterBottom>
                            My Orders
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <StyledCard>
                                    <CardContent>
                                        {data?.length === 0 ? (
                                            <Typography variant="body1" component="p">
                                                You have no orders.
                                            </Typography>
                                        ) : (
                                            <TableContainer component={Paper}>
                                                <Table aria-label="orders table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell />
                                                            <TableCell>STT</TableCell>
                                                            <TableCell align="right">Destination</TableCell>
                                                            <TableCell align="right">Order Date</TableCell>
                                                            <TableCell align="right">Total Amount</TableCell>
                                                            <TableCell align="right">Status</TableCell>
                                                            <TableCell align="right">Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data && data?.map((order, index) => (
                                                            <React.Fragment key={order.id}>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <IconButton
                                                                            aria-label="expand row"
                                                                            size="small"
                                                                            onClick={() => handleToggle(order.id)}
                                                                        >
                                                                            {open[order.id] ? <ExpandMoreIcon /> : <ExpandMoreIcon />}
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell component="th" scope="row">
                                                                        {index + 1}
                                                                    </TableCell>
                                                                    <TableCell align="right">{order.destination}</TableCell>
                                                                    <TableCell align="right">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                                    <TableCell align="right">{order.cost}</TableCell>
                                                                    <TableCell align="right">{order.status}</TableCell>
                                                                    <TableCell align="right">
                                                                        <IconButton aria-label="edit" onClick={() => handleEdit(order)}>
                                                                            <EditIcon />
                                                                        </IconButton>
                                                                        <IconButton aria-label="delete" onClick={() => handleDelete(order)}>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                                        <Collapse in={open[order.id]} timeout="auto" unmountOnExit>
                                                                            <Box margin={1}>
                                                                                <Typography variant="h6" gutterBottom component="div">
                                                                                    Order Details
                                                                                </Typography>
                                                                                <Table size="small" aria-label="purchases">
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <TableCell>Image</TableCell>
                                                                                            <TableCell>Product</TableCell>
                                                                                            <TableCell>Quantity</TableCell>
                                                                                            <TableCell align="right">Price</TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {order?.orderDetails?.products.map((product) => (
                                                                                            <TableRow key={product.id}>
                                                                                                <TableCell component="th" scope="row">
                                                                                                    <img src={product.mainImage} alt={product.productName} style={{ width: '50px', height: '50px' }} />
                                                                                                </TableCell>
                                                                                                <TableCell component="th" scope="row">
                                                                                                    <Link to={`/product/${product.productId}`}>{product.productName}</Link>
                                                                                                </TableCell>
                                                                                                <TableCell>{product.quantity}</TableCell>
                                                                                                <TableCell align="right">{product.price}</TableCell>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </Box>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        </Grid>
                        <div className='d-flex align-items-center' style={{ marginBottom: '16px' }}>
                            <Link to="/">
                                <Button className='btn-g' variant="contained" color="primary" style={{ fontSize: '18px' }}>
                                    <KeyboardBackspaceIcon /> Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </StyledSection>
                )
            }

            <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
                <DialogTitle>Edit Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Destination"
                        type="text"
                        fullWidth
                        value={currentOrder?.destination || ''}
                        onChange={(e) => setCurrentOrder({ ...currentOrder, destination: e.target.value })}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MyOrdersPage;
