import { Field, ObjectType, Int, ID } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index, OneToMany } from "typeorm";
import { Answer } from "./answer";
import { Full_Question } from "./full_question";
import { Respondent } from "./respondent";

@ObjectType()
@Entity()
export class Posted_Answer {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid!: string;

  @Field(type => Full_Question)
  @ManyToOne(type => Full_Question, full_question => full_question.postedAnswers, { nullable: false })
  @JoinColumn({ referencedColumnName: "uuid" })
  full_question!: Full_Question;

  @Field(type => Answer)
  @ManyToOne(type => Answer, answer => answer.posted_answers, { nullable: false })
  @JoinColumn({ referencedColumnName: "uuid" })
  answer!: Answer;

  @Field(type => Respondent)
  @ManyToOne(type => Respondent, respondent => respondent.posted_answer, { nullable: false })
  @JoinColumn({referencedColumnName: "uuid"})
  respondent!: Respondent
}