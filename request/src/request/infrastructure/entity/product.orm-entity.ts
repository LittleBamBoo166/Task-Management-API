import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EquipmentRequest } from './equipment-request.orm-entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  quantity: number;

  @Column({ type: 'timestamptz' })
  receivedDate: Date;

  @ManyToOne(() => EquipmentRequest, (request) => request.products)
  equipmentRequest: EquipmentRequest;
}
