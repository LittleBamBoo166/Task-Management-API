import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.orm-entity';

@Entity()
export class EquipmentRequest {
  @PrimaryColumn()
  requestId: string;

  @Column()
  equipmentType: string;

  @Column()
  reason: string;

  @OneToMany(() => Product, (product) => product.equipmentRequest)
  products: Product[];
}
