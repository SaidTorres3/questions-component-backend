import { Field, ObjectType, Int } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, RelationId } from "typeorm";
import { Full_Question } from "./full_question";

@ObjectType()
@Entity()
export class Question {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => Full_Question)
  @OneToOne(type => Full_Question)
  @JoinColumn({referencedColumnName: "uuid"})
  full_question: Full_Question['uuid'];

  @Field(type => String)
  @Column("text")
  es: string;
  
  @Field(type => String)
  @Column("text")
  en: string;
}