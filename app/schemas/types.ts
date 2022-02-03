export type GraphQLSchema = {
  query?: string;
  mutation?: string;
  subscription?: string;
  typeDef?: Record<string, string>;
};
