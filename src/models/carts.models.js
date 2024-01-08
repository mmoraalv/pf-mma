import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId, //Id autogenerado de MongoDB
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true //default: 1
                }
            }
        ],
        default: function () {
            return []
        }
    }
}
)

cartSchema.pre('findOne', function () {
    this.populate('products.id_prod')
})

const cartModel = model('carts', cartSchema)
export default cartModel