import { Field, ID, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, OneToMany } from "typeorm";
import { Answer } from "./answer";
import { Question } from "./question";

@ObjectType()
@Entity()
export class Full_Question {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid!: string;

  @Field({ nullable: true })
  @Column("text")
  imgUrl: string;

  @Field(type => Question)
  @OneToOne(type => Question)
  question!: Question;

  @Field(type => [Answer])
  @OneToMany(type => Answer, answer => answer.full_question)
  answers!: Answer[];
}