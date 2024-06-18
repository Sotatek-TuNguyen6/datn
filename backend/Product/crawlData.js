const axios = require("axios");
const fs = require('fs').promises;
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const { randomInt } = require("crypto");

// let arraysId = ['491997823', '491997835',
//     '491997836', '491997837'];
const nameProduct = [
    "vel-special-sambrani-powder",
    "ib-wicks-cotton",
    "cotton-wicks-bulbs",
    "ganapati-modak-mould-2-pc",
    "ib-brass-agarbatti-stand",
    "lakshmi-charan-paduka",
    "ganesh-idol-and-kumkum-haldi-leaf-set-combo",
    "kids-rakhis-shinchan",
    "ib-gift-card-r500",
    "kids-rakhis-doremon",
    "raksha-bandhan-greetings-card-1",
    "ib-gift-card-r750",
    "ib-gift-card",
    "sandal-powder-puja-powder-scented-10g",
    "holi-colors-assorted-1kg"
]
const getAllData = async (name) => {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.indiabazaar.co.za/products/${name}.js`,
            headers: {
                'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'host': 'www.indiabazaar.co.za',
                'Cookie': '_cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22sale_of_data_region%22%3Afalse%7D; _shopify_s=438ffa1a-ad12-4fe0-bd58-fbc2d9689bcb; _shopify_y=6030eb3f-a1ac-4a08-945d-64cdeb40bdf1; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%22%22%2C%22m%22%3A%22%22%2C%22p%22%3A%22%22%2C%22s%22%3A%22%22%7D%7D%2C%22v%22%3A%222.1%22%2C%22region%22%3A%22VNHN%22%2C%22reg%22%3A%22%22%7D; localization=ZA; receive-cookie-deprecation=1; secure_customer_sig='
            }
        };
        const response = await axios.request(config);
        return response.data
    } catch (error) {
        console.log(error);
    }
};

// const processBatch = async (batch) => {
//     console.log("🚀 ~ processBatch ~ batch:", batch)
//     const productDetailPromises = batch.map((item) => {
//         return axios.get(
//             `https://www.reliancedigital.in/rildigitalws/v2/rrldigital/cms/pagedata?pageType=productPage&pageId=productPage&productCode=${item}`
//         );
//     });

//     const productDetails = await Promise.all(productDetailPromises);
//     console.log("🚀 ~ processBatch ~ productDetails:", productDetails)

//     return productDetails.map(detailProduct => {
//         console.log("🚀 ~ processBatch ~ detailProduct:", detailProduct.data.data)
// return {
//     productName: detailProduct.data.data.productData?.name,
//     price: detailProduct.data.data.productData?.price?.value,
//     priceSale: detailProduct.data.data.productData?.price?.mrp,
//     description: detailProduct.data.data.productData?.description,
//     ratings: randomInt(5),
//     images: detailProduct.data.data.productData?.media.map((item) => `https://www.reliancedigital.in${item.productImageUrl}`),
//     mainImage: `https://www.reliancedigital.in${detailProduct.data.data.productData?.media[0]?.productImageUrl}`,
//     stockQuantity: 200,
//     brand: detailProduct.data.data.productData?.brand
// };
//     });
// };

// const getDetailsProduct = async () => {
//     try {
//         await getAllData();
//         const batches = [];
//         for (let i = 0; i < arraysId.length; i += 5) {
//             batches.push(arraysId.slice(i, i + 5));
//         }

//         let allProductData = [];
//         for (const batch of batches) {
//             const batchData = await processBatch(batch);
//             console.log("🚀 ~ getDetailsProduct ~ batchData:", batchData)
//             allProductData = allProductData.concat(batchData);
//             console.log("🚀 ~ getDetailsProduct ~ allProductData:", allProductData)

//         }

// fs.writeFile('productDetails.json', JSON.stringify(allProductData, null, 2), (err) => {
//     if (err) {
//         console.error('Error writing to file', err);
//     } else {
//         console.log('Data successfully written to file');
//     }
// });
//     } catch (error) {
//         console.error(error);
//     }
// };

// getDetailsProduct();


const saveProductDetails = async (nameProduct) => {
    try {
        const data = await getAllData(nameProduct); // Assuming getAllData retrieves product data asynchronously

        // Create an object with the desired product details
        const productDetails = {
            productName: data?.title,
            price: data?.price_max,
            priceSale: data?.price,
            description: data?.description,
            type: 'kg',
            specifications: data?.variants.map((item) => item.option1),
            ratings: randomInt(5),
            images: data?.images,
            mainImage: data?.featured_image,
            stockQuantity: 200,
            brand: data?.vendor,
            categoryId: '6671b445f289714f42f65072',
            categoryName: 'Festivals & Occasions',
            subCategoryName: 'Festivals & Occasions'
        };

        // Read existing data from file (if any)
        let existingProducts = [];
        try {
            const fileData = await fs.readFile('productDetails.json', 'utf8');
            existingProducts = JSON.parse(fileData);
        } catch (error) {
            console.error('Error reading productDetails.json:', error);
            // If file doesn't exist or is empty, continue with an empty array
        }

        // Push new product details to existing products array
        existingProducts.push(productDetails);

        // Write updated data back to the file
        await fs.writeFile('productDetails.json', JSON.stringify(existingProducts, null, 2), 'utf8');

        console.log(`Product details for '${nameProduct}' saved successfully.`);

    } catch (error) {
        console.error(`Error processing product '${nameProduct}':`, error);
    }
};

const main = async () => {

    for (const name of nameProduct) {
        try {
            await saveProductDetails(name);
        } catch (error) {
            console.error('Error processing product:', nameProduct, error);
            // Handle individual product error here if needed
        }
    }


};

// Example usage:
main();