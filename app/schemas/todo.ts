const tableName = "todos";

export const definition = `
type ${tableName} {
  id: ID!
  name: String
}
type Query {
  getTodo(id: ID!): ${tableName}
}
type Mutation {
  addTodo(name: String!): ${tableName}
  deleteItem(id: ID!): ${tableName}
}
type Schema {
  query: Query
  mutation: Mutation
}
`;
