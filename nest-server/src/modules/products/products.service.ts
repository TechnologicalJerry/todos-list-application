import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel({
      ...createProductDto,
      user: new mongoose.Types.ObjectId(userId),
    });
    return product.save();
  }

  async findByProductId(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({ productId }).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }

  async update(
    userId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const product = await this.findByProductId(productId);

    if (product.user.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this product');
    }

    const updated = await this.productModel
      .findOneAndUpdate({ productId }, { $set: updateProductDto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return updated;
  }

  async remove(userId: string, productId: string): Promise<{ success: boolean }> {
    const product = await this.findByProductId(productId);

    if (product.user.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this product');
    }

    await this.productModel.deleteOne({ productId }).exec();
    return { success: true };
  }
}
