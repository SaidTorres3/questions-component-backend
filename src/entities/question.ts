import { Field, ID, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, OneToMany } from "typeorm";
import { Answer } from "./answer";
import { Posted_Answer } from "./posted_answer";

@ObjectType()
@Entity()
export class Question {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid!: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  imgUrl: string;
  
  @Field(type => String)
  @Column("text")
  es: string;
  
  @Field(type => String)
  @Column("text")
  en: string;

  @Field(type => [Answer])
  @OneToMany(type => Answer, answer => answer.question)
  answers: Answer[];

  @Field(type => [Posted_Answer])
  @OneToMany(type => Posted_Answer, postedAnswer => postedAnswer.question, { nullable: true })
  posted_answers: Posted_Answer[];
}