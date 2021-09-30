import { Field, ObjectType, Int, ID } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, Column, Index } from "typeorm";
import { Full_Question } from "./full_question";
import { Posted_Answer } from "./posted_answer";

@ObjectType()
@Entity()
export class Respondent {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid!: string;

  @Field(type => Full_Question)
  @ManyToOne(type => Full_Question, full_question => full_question.postedAnswers)
  @JoinColumn({ referencedColumnName: "uuid" })
  full_question!: Full_Question;

  @Field(type => [Posted_Answer])
  @OneToMany(type => Posted_Answer, posted_answer => posted_answer.respondent, {nullable: true})
  @JoinColumn({ referencedColumnName: "uuid" })
  posted_answer: [Posted_Answer];
}