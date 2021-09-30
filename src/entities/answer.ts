import GraphQLJSON from "graphql-type-json";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index, OneToMany } from "typeorm";
import { Full_Question } from "./full_question";
import { Posted_Answer } from "./posted_answer";

@ObjectType()
@Entity()
export class Answer {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid!: string;

  @Field(type => Full_Question)
  @ManyToOne(type => Full_Question, full_question => full_question.answers)
  @JoinColumn({ referencedColumnName: "uuid" })
  full_question!: Full_Question;

  @Field(type => [Posted_Answer])
  @OneToMany(type => Posted_Answer, postedAnswer => postedAnswer.answer, { nullable: true })
  posted_answers: Posted_Answer[];

  @Field(type => GraphQLJSON)
  @Column('simple-json')
  value!: any;
  
  @Field(type => String)
  @Column("text")
  es!: string;
  
  @Field(type => String)
  @Column("text")
  en!: string;
}