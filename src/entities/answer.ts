import GraphQLJSON from "graphql-type-json";
import { Field, ObjectType, Int } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Full_Question } from "./full_question";

@ObjectType()
@Entity()
export class Answer {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => Full_Question)
  @ManyToOne(type => Full_Question, full_question => full_question.answers)
  @JoinColumn({ referencedColumnName: "uuid" })
  full_question!: Full_Question['uuid'];

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