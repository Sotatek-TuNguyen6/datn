export function formatMoneyVND(amount, quantity = 1){
    if (!amount || isNaN(amount) || !quantity || isNaN(quantity)) {
      return "Invalid amount or quantity";
    }
    const total = amount * quantity;
    return total.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }