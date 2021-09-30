import { Field, ObjectType, Int } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { Answer } from "./answer";
import { Full_Question } from "./full_question";

@ObjectType()
@Entity()
export class PostedAnswer {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => Full_Question)
  @ManyToOne(type => Full_Question, full_question => full_question.postedAnswers, { nullable: false })
  @JoinColumn({ referencedColumnName: "uuid" })
  full_question!: Full_Question;

  @Field(type => Answer)
  @ManyToOne(type => Answer, answer => answer.postedAnswers, { nullable: false })
  @JoinColumn({ referencedColumnName: "uuid" })
  answer!: Full_Question['uuid'];
}