const {gql} = require('apollo-server')

module.exports = gql`
    type User {
        _id: ID
        name: String
        email: String
        picture: String
    } 

    type Pin {
        _id: ID
        createdAt: String
        mood: Float
        note: String
        image: String
        latitude: Float
        longitude: Float
        author: User
        comments: [Comment]
    }

    type Comment {
        text: String
        createdAt: String
        author: User
    }

    input CreatePinInput {
        image: String
        note: String
        mood: Float
        latitude: Float
        longitude: Float
    }

    input EditPinInput {
        pinId: ID
        image: String 
        note: String
        mood: Float
    }

    type Query {
        me: User
        getPins: [Pin!]
    }

    type Mutation {
        createPin(input: CreatePinInput!): Pin
        editPin(input: EditPinInput!): Pin
        deletePin(pinId: ID!): Pin
        createComment(pinId: ID!, text: String!): Pin
    }

    type Subscription {
        pinAdded: Pin
        pinUpdated: Pin
        pinDeleted: Pin
        commentAdded: Pin
    }

`