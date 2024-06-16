import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  ListItemButton,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService/index";
import "./main.css";
import { useMutation } from "@tanstack/react-query";
import { resetUser, updateUser } from "../../features/userSlice/userSlice";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import icon giỏ hàng

const StyledSection = styled("section")(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  margin: theme.spacing(4, 0),
  fontSize: "18px",
}));
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "none",
  border: "1px solid #e0e0e0",
  fontSize: "18px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: "18px",
}));

const AccountPage = () => {
  const user = useSelector((state) => state.user);
  const [editUser, setEditUser] = useState(user);
  const location = useLocation();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleAddressChange = (index, event) => {
    const newAddresses = editUser.addresses.map((address, i) =>
      i === index ? event.target.value : address
    );
    setEditUser({ ...editUser, addresses: newAddresses });
  };

  const handleAddAddress = () => {
    setEditUser({ ...editUser, addresses: [...editUser.addresses, ""] });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = editUser.addresses.filter((_, i) => i !== index);
    setEditUser({ ...editUser, addresses: newAddresses });
  };

  const handleGetDetailsUser = async (id, accessToken) => {
    const header = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const userDetails = await UserService.getDetailUser(id, header);

      dispatch(updateUser({ ...userDetails, access_token: accessToken }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };
  const history = useNavigate();

  const mutationChangeUser = useMutation({
    mutationFn: ({ data, token }) => UserService.updateUser(data, token),
    onSuccess: () => {
      handleGetDetailsUser(editUser.id, editUser.access_token);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

  const isActive = (path) => location.pathname === path;

  const handleChangeUser = async () => {
    const { access_token, wishlist, username, id, ...userWithoutToken } =
      editUser;
    mutationChangeUser.mutate({ data: userWithoutToken, token: access_token });
  };
  const onLogout = async () => {
    dispatch(resetUser());
    localStorage.removeItem("access_token");
    history("/");
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <StyledSection>
      <Typography variant="h4" component="h1" gutterBottom>
        My Account
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Account Options
              </Typography>
              <List component="nav">
                <ListItemButton
                  component={Link}
                  to="/account"
                  selected={isActive("/account")}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Personal Information" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/order-tracking"
                  selected={isActive("/order-tracking")}
                >
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Orders" />
                </ListItemButton>
                <ListItemButton component={Link} to="/wishlist">
                  <ListItemIcon>
                    <FavoriteIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Wishlist" />
                </ListItemButton>
                <ListItemButton component={Link} to="/cart">
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cart" />
                </ListItemButton>
                <ListItemButton button onClick={onLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Personal Information
              </Typography>
              <TextField
                label="Name"
                name="name"
                value={editUser.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ style: { fontSize: "18px" } }}
                InputLabelProps={{ style: { fontSize: "18px" } }}
              />
              <TextField
                label="Email"
                name="email"
                value={editUser.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ style: { fontSize: "18px" } }}
                InputLabelProps={{ style: { fontSize: "18px" } }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={editUser.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ style: { fontSize: "18px" } }}
                InputLabelProps={{ style: { fontSize: "18px" } }}
              />
              {editUser.addresses.map((address, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <TextField
                    label={`Address ${index + 1}`}
                    value={address}
                    onChange={(event) => handleAddressChange(index, event)}
                    fullWidth
                    margin="normal"
                    InputProps={{ style: { fontSize: "18px" } }}
                    InputLabelProps={{ style: { fontSize: "18px" } }}
                  />
                  <IconButton onClick={() => handleRemoveAddress(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <div>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleAddAddress}
                  startIcon={<AddIcon />}
                  style={{ marginTop: "16px", fontSize: "18px" }}
                >
                  Add Address
                </StyledButton>
              </div>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleChangeUser}
              >
                Save Changes
              </StyledButton>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </StyledSection>
  );
};

export default AccountPage;
