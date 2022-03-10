import GraphQLJSON from "graphql-type-json";
import { Field, ObjectType, Int, ID } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Question } from "./question";
import { Posted_Answer } from "./posted_answer";

@ObjectType()
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((type) => ID)
  @Column("uuid", { nullable: false, generated: "uuid" })
  @Index("uuid", { unique: true })
  uuid!: string;

  @Field((type) => Question)
  @ManyToOne((type) => Question, (question) => question.answers)
  @JoinColumn({ referencedColumnName: "uuid" })
  question!: Question;

  @Field((type) => [Posted_Answer])
  @OneToMany((type) => Posted_Answer, (postedAnswer) => postedAnswer.answer, {
    nullable: true,
  })
  posted_answers: Posted_Answer[];

  @Field((type) => GraphQLJSON)
  @Column("simple-json")
  value!: any;

  @Field((type) => String)
  @Column("text")
  es!: string;

  @Field((type) => String)
  @Column("text")
  en!: string;

  @Field((type) => Date, { nullable: false })
  @CreateDateColumn()
  createdAt!: Date;
}
