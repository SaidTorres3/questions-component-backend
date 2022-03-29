import { Field, ObjectType, ID } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Respondent } from "./respondent";

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((type) => ID)
  @Column("uuid", { nullable: false, generated: "uuid" })
  @Index("uuid", { unique: true })
  uuid!: string;

  @Field((type) => Date, { nullable: false })
  @CreateDateColumn()
  createdAt!: Date;

  @Field((type) => String)
  @Column("text", { unique: true })
  username!: string;

  @Field((type) => String)
  @Column("text")
  password!: string;

  @Field((type) => String)
  @Column("text")
  type!: UserType;

  @Field((type) => [Respondent], { nullable: true })
  @OneToMany(
    (type) => Respondent,
    (respondent) => respondent,
    { nullable: true }
  )
  @JoinColumn({ referencedColumnName: "uuid" })
  respondents: Respondent[];
}

@ObjectType()
export class CreateQuestionPayload {
  @Field((type) => ID, { nullable: false })
  createdUuid!: string;
}

export enum UserType {
  admin = "admin",
  pollster = "pollster",
}
