import { Field, ObjectType, Int, ID, Float } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  Column,
  Index,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Posted_Answer } from "./posted_answer";
import { User } from "./user";

@ObjectType()
@Entity()
export class Respondent {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((type) => ID)
  @Column("uuid", { nullable: false, generated: "uuid" })
  @Index("uuid", { unique: true })
  uuid!: string;

  @Field((type) => Date, { nullable: false })
  @CreateDateColumn()
  createdAt!: Date;

  @Field((type) => Float)
  @Column("float", { nullable: true })
  avgScore?: number;

  @Field((type) => [Posted_Answer])
  @OneToMany(
    (type) => Posted_Answer,
    (posted_answer) => posted_answer.respondent,
    { nullable: true }
  )
  @JoinColumn({ referencedColumnName: "uuid" })
  posted_answers!: Posted_Answer[];

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.respondents, { nullable: true })
  @JoinColumn({ referencedColumnName: "uuid" })
  user!: User;
}
