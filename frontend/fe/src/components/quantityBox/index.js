import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { updateCart } from '../../features/cart/cartSlice';

const QuantityBox = (props) => {
  const [inputValue, setInputValue] = useState(props.item.quantity);
  const dispatch = useDispatch();
  const { listCart } = useSelector((state) => state.cart);

  const plus = () => {
    const newQuantity = inputValue + 1;
    setInputValue(newQuantity);
    updateCartQuantity(newQuantity);
  };

  const minus = () => {
    if (inputValue > 1) {
      const newQuantity = inputValue - 1;
      setInputValue(newQuantity);
      updateCartQuantity(newQuantity);
    }
  };

  const updateCartQuantity = (newQuantity) => {
    const updatedCart = listCart.map((cartItem) => {
      return cartItem._id === props.item._id
        ? { ...cartItem, quantity: newQuantity }
        : cartItem;
    });

    dispatch(updateCart(updatedCart[0]));
  };

  return (
    <div className="addCartSection pt-4 pb-4 d-flex align-items-center">
      <div className="counterSec mr-3">
        <input
          type="number"
          value={inputValue}
          readOnly
        />
        <span className="arrow plus" onClick={plus}>
          <KeyboardArrowUpIcon />
        </span>
        <span className="arrow minus" onClick={minus}>
          <KeyboardArrowDownIcon />
        </span>
      </div>
    </div>
  );
};

export default QuantityBox;
