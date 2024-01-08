import { faker } from '@faker-js/faker'

const generateMockProducts = async (req, res) => {
    try {
        const products = [];
        for (let i = 0; i < 100; i++) {
            const productData = {
                _id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                stock: faker.number.int({ min: 10, max: 100 }),
                category: faker.commerce.department(),
                status: true,
                code: faker.string.alphanumeric(10),
                thumbnails: [faker.image.url()]
            };
            
            products.push(productData);
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default generateMockProducts;