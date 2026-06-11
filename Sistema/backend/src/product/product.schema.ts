import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop({ type: Object })
  attributes: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
