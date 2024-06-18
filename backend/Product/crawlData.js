const axios = require("axios");
const fs = require("fs");
const { randomInt } = require("crypto");

let arraysId = ['491997823', '491997835',
    '491997836', '491997837'];

const getAllData = async () => {
    const result = await axios.get(
        `https://www.reliancedigital.in/rildigitalws/v2/rrldigital/cms/pagedata?pageType=categoryPage&categoryCode=101039&searchQuery=&page=0&size=24&pc=`
    );
    if (result) {
        const dataResult = result.data.data.productListData.results.map(
            (item) => item.code
        );
        arraysId = dataResult;
    } else {
        console.log("Not found");
    }
};


const processBatch = async (batch) => {
    console.log("🚀 ~ processBatch ~ batch:", batch)
    const productDetailPromises = batch.map((item) => {
        return axios.get(
            `https://www.reliancedigital.in/rildigitalws/v2/rrldigital/cms/pagedata?pageType=productPage&pageId=productPage&productCode=${item}`
        );
    });

    const productDetails = await Promise.all(productDetailPromises);
    console.log("🚀 ~ processBatch ~ productDetails:", productDetails)

    return productDetails.map(detailProduct => {
        console.log("🚀 ~ processBatch ~ detailProduct:", detailProduct.data.data)
        return {
            productName: detailProduct.data.data.productData?.name,
            price: detailProduct.data.data.productData?.price?.value,
            priceSale: detailProduct.data.data.productData?.price?.mrp,
            description: detailProduct.data.data.productData?.description,
            ratings: randomInt(5),
            images: detailProduct.data.data.productData?.media.map((item) => `https://www.reliancedigital.in${item.productImageUrl}`),
            mainImage: `https://www.reliancedigital.in${detailProduct.data.data.productData?.media[0]?.productImageUrl}`,
            stockQuantity: 200,
            brand: detailProduct.data.data.productData?.brand
        };
    });
};

const getDetailsProduct = async () => {
    try {
        await getAllData(); 
        const batches = [];
        for (let i = 0; i < arraysId.length; i += 5) {
            batches.push(arraysId.slice(i, i + 5));
        }

        let allProductData = [];
        for (const batch of batches) {
            const batchData = await processBatch(batch);
            console.log("🚀 ~ getDetailsProduct ~ batchData:", batchData)
            allProductData = allProductData.concat(batchData);
            console.log("🚀 ~ getDetailsProduct ~ allProductData:", allProductData)
            
        }

        fs.writeFile('productDetails.json', JSON.stringify(allProductData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Data successfully written to file');
            }
        });
    } catch (error) {
        console.error(error);
    }
};

getDetailsProduct();
