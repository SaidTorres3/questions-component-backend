import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Full_Question } from "./full_question";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Full_Question)
  @JoinColumn()
  full_question_id: number;

  @Column('text')
  value: string;

  @Column("text")
  es: string;

  @Column("text")
  en: string;
}