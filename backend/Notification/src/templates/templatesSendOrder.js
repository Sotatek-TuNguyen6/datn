module.exports = function (messageContent) {
    const {products, amount} = messageContent
    let total = amount;
    let productRows = products.map(product => {
        return `
            <tr>
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #007bff;
                color: #ffffff;
                padding: 10px 0;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin: 0 0 10px;
            }
            .order-details {
                margin: 20px 0;
            }
            .order-details table {
                width: 100%;
                border-collapse: collapse;
            }
            .order-details th, .order-details td {
                border: 1px solid #dddddd;
                padding: 8px;
                text-align: left;
            }
            .order-details th {
                background-color: #f8f8f8;
            }
            .footer {
                text-align: center;
                padding: 10px;
                background-color: #f8f8f8;
                color: #666666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
            </div>
            <div class="content">
                <p>Dear ,</p>
                <p>Thank you for your order! Here are the details of your purchase:</p>
                <div class="order-details">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                        </tbody>
                    </table>
                </div>
                <p>Total: $${total}</p>
                <p>We hope you enjoy your purchase! If you have any questions, feel free to contact us.</p>
                <p>Best regards,<br>The [Your Company] Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 [Your Company]. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
