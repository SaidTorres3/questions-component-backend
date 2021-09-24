import { Field, ID, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@ObjectType()
@Entity()
export class Full_Question {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => ID)
  @Column('uuid', { nullable: false, generated: 'uuid' })
  @Index('uuid', { unique: true })
  uuid: string;

  @Field({ nullable: true })
  @Column("text")
  imgUrl: string;
}