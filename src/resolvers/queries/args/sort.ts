import { Field, InputType, registerEnumType } from "type-graphql";

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}
registerEnumType(SortDirection, { name: 'SortDirection' });

export enum SortNulls {
  First = 'NULLS FIRST',
  Last = 'NULLS LAST',
}
registerEnumType(SortNulls, { name: 'SortNulls' });

export function SortInput<T extends string | number>(by: { [key: string]: T; }) {

  @InputType({ isAbstract: true })
  abstract class SortInputClass {

    @Field(type => by, { nullable: false })
    by!: T;

    @Field(type => SortDirection, { nullable: true, defaultValue: SortDirection.Asc })
    direction!: SortDirection;

    @Field(type => SortNulls, { nullable: true, defaultValue: SortNulls.Last })
    nulls!: SortNulls;

  }

  return SortInputClass;

}
