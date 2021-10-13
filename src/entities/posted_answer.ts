import { Field, ObjectType, Int, ID } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index, RelationId } from "typeorm";
import { Answer } from "./answer";
import { Question } from "./question";
import { Respondent } from "./respondent";

@ObjectType()
@Entity()
export class Posted_Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid!: string;

  @Field(type => Question)
  @ManyToOne(type => Question, question => question.posted_answers, { nullable: false })
  @JoinColumn({ referencedColumnName: "uuid" })
  question!: Question;
  @RelationId("question")
  questionUuid: Question['uuid']

  @Field(type => Answer)
  @ManyToOne(type => Answer, answer => answer.posted_answers, { nullable: false })
  @JoinColumn({ referencedColumnName: "uuid" })
  answer!: Answer;
  @RelationId("answer")
  answerUuid: Answer['uuid']

  @Field(type => Respondent)
  @ManyToOne(type => Respondent, respondent => respondent.posted_answers, { nullable: false })
  @JoinColumn({referencedColumnName: "uuid"})
  respondent!: Respondent
  @RelationId("respondent")
  respondentUuid: Respondent['uuid']
}