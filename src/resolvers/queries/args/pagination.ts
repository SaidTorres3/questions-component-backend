import { Min } from "class-validator";
import { ArgsType, ClassType, Field, Int, ObjectType } from "type-graphql";

@ArgsType()
export class PaginationArgs {

  @Field(type => Int, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip!: number;

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  @Min(1)
  take!: number;

}

export function PaginatedPayload<Item>(item: ClassType<Item>) {

  @ObjectType({ isAbstract: true })
  abstract class PaginatedPayloadClass {

    @Field(type => [item], { nullable: false })
    items!: Item[];

    @Field(type => Int, { nullable: false })
    total!: number;

    @Field(type => Int, { nullable: false })
    skip!: number;

    @Field(type => Int, { nullable: false })
    take!: number;

    @Field(type => Boolean, { nullable: false })
    hasMore!: boolean;

  }

  return PaginatedPayloadClass;

}
