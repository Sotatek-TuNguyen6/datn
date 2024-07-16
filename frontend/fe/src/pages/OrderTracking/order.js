import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Button } from '@mui/material';

const StyledSection = styled('section')(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    margin: theme.spacing(4, 0),
    fontSize: '18px',
    '*': {
        fontSize: '18px',
    }
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    fontSize: '18px',
}));

const MyOrdersPage = () => {
    const { orders } = useSelector((state) => state.user);
    useEffect(()=>{
        window.scrollTo(0, 0)
    }, [])

    return (
        <StyledSection>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            {orders.length === 0 ? (
                                <Typography variant="body1" component="p">
                                    You have no orders.
                                </Typography>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table aria-label="orders table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell align="right">Order Date</TableCell>
                                                <TableCell align="right">Total Amount</TableCell>
                                                <TableCell align="right">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell component="th" scope="row">
                                                        {order.id}
                                                    </TableCell>
                                                    <TableCell align="right">{new Date(order.date).toLocaleDateString()}</TableCell>
                                                    <TableCell align="right">{order.totalAmount}</TableCell>
                                                    <TableCell align="right">{order.status}</TableCell>
                                                </TableRow>
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
    );
};

export default MyOrdersPage;
