import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Full_Question } from "./full_question";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Full_Question)
  @JoinColumn()
  full_question: number;

  @Column("text")
  es: string;
  
  @Column("text")
  en: string;
}