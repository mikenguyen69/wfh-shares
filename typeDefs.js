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
        weather: String
        feeling: String
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
        weather: String
        feeling: String
        image: String
        note: String
        latitude: Float
        longitude: Float
    }

    input EditPinInput {
        pinId: ID
        weather: String
        feeling: String
        image: String
        note: String
    }

    type Query {
        me: User
        getPins: [Pin!]
    }

    type Mutation {
        createPin(input: CreatePinInput!): Pin
        editPin(input: EditPinInput!): Pin
        createComment(pinId: ID!, text: String!): Pin
    }

    type Subscription {
        pinAdded: Pin
        pinUpdated: Pin
        commentAdded: Pin
    }

`