import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Full_Question {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column("text")
  img: string;
}