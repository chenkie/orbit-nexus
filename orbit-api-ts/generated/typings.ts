/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  AuthenticationResult: { // root type
    expiresAt: string; // String!
    message: string; // String!
    token: string; // String!
    userInfo: NexusGenRootTypes['User']; // User!
  }
  DashboardData: { // root type
    graphData: NexusGenRootTypes['Sale'][]; // [Sale!]!
    newCustomers: number; // Int!
    refunds: number; // Int!
    salesVolume: number; // Int!
  }
  InventoryItem: { // root type
    _id: string; // ID!
    image: string; // String!
    itemNumber: string; // String!
    name: string; // String!
    unitPrice: string; // String!
    user: string; // String!
  }
  InventoryItemResult: { // root type
    inventoryItem: NexusGenRootTypes['InventoryItem']; // InventoryItem!
    message: string; // String!
  }
  Mutation: {};
  Query: {};
  Sale: { // root type
    amount: number; // Int!
    date: string; // String!
  }
  User: { // root type
    _id: string; // ID!
    avatar?: string | null; // String
    bio?: string | null; // String
    email: string; // String!
    firstName: string; // String!
    lastName: string; // String!
    role: string; // String!
  }
  UserBio: { // root type
    bio: string; // String!
  }
  UserBioUpdateResult: { // root type
    message: string; // String!
    userBio: NexusGenRootTypes['UserBio']; // UserBio!
  }
  UserUpdateResult: { // root type
    message: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
}

export interface NexusGenFieldTypes {
  AuthenticationResult: { // field return type
    expiresAt: string; // String!
    message: string; // String!
    token: string; // String!
    userInfo: NexusGenRootTypes['User']; // User!
  }
  DashboardData: { // field return type
    graphData: NexusGenRootTypes['Sale'][]; // [Sale!]!
    newCustomers: number; // Int!
    refunds: number; // Int!
    salesVolume: number; // Int!
  }
  InventoryItem: { // field return type
    _id: string; // ID!
    image: string; // String!
    itemNumber: string; // String!
    name: string; // String!
    unitPrice: string; // String!
    user: string; // String!
  }
  InventoryItemResult: { // field return type
    inventoryItem: NexusGenRootTypes['InventoryItem']; // InventoryItem!
    message: string; // String!
  }
  Mutation: { // field return type
    addInventoryItem: NexusGenRootTypes['InventoryItemResult']; // InventoryItemResult!
    deleteInventoryItem: NexusGenRootTypes['InventoryItemResult']; // InventoryItemResult!
    login: NexusGenRootTypes['AuthenticationResult']; // AuthenticationResult!
    signup: NexusGenRootTypes['AuthenticationResult']; // AuthenticationResult!
    updateUserBio: NexusGenRootTypes['UserBioUpdateResult']; // UserBioUpdateResult!
    updateUserRole: NexusGenRootTypes['UserUpdateResult']; // UserUpdateResult!
  }
  Query: { // field return type
    dashboardData: NexusGenRootTypes['DashboardData']; // DashboardData!
    inventoryItems: NexusGenRootTypes['InventoryItem'][]; // [InventoryItem!]!
    user: NexusGenRootTypes['User']; // User!
    userBio: NexusGenRootTypes['UserBio']; // UserBio!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  Sale: { // field return type
    amount: number; // Int!
    date: string; // String!
  }
  User: { // field return type
    _id: string; // ID!
    avatar: string | null; // String
    bio: string | null; // String
    email: string; // String!
    firstName: string; // String!
    lastName: string; // String!
    role: string; // String!
  }
  UserBio: { // field return type
    bio: string; // String!
  }
  UserBioUpdateResult: { // field return type
    message: string; // String!
    userBio: NexusGenRootTypes['UserBio']; // UserBio!
  }
  UserUpdateResult: { // field return type
    message: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addInventoryItem: { // args
      itemNumber?: string | null; // String
      name?: string | null; // String
      unitPrice?: number | null; // Float
    }
    deleteInventoryItem: { // args
      id?: string | null; // ID
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    signup: { // args
      email: string; // String!
      firstName?: string | null; // String
      lastName?: string | null; // String
      password?: string | null; // String
    }
    updateUserBio: { // args
      bio?: string | null; // String
    }
    updateUserRole: { // args
      role: string; // String!
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthenticationResult" | "DashboardData" | "InventoryItem" | "InventoryItemResult" | "Mutation" | "Query" | "Sale" | "User" | "UserBio" | "UserBioUpdateResult" | "UserUpdateResult";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}