const tableName = "items";

export default `
type ${tableName} {
  id: ID!
  name: String
}
type Query {
  getItem(id: ID!): ${tableName}
}
type Mutation {
  addItem(name: String!): ${tableName}
  deleteItem(id: ID!): ${tableName}
}
type Schema {
  query: Query
  mutation: Mutation
}
`;
