import { Field, ObjectType, Int } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Full_Question } from "./full_question";

@ObjectType()
@Entity()
export class Answer {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => String)
  @OneToOne(type => Full_Question)
  @JoinColumn({ referencedColumnName: "uuid" })
  full_question: string;

  @Field(type => String)
  @Column('text')
  value: string;
  
  @Field(type => String)
  @Column("text")
  es: string;
  
  @Field(type => String)
  @Column("text")
  en: string;
}