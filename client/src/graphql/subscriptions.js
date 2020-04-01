import gql from 'graphql-tag'

export const PIN_ADDED_SUBSCRIPTION = gql`
    subscription {
        pinAdded {
            _id
            createdAt
            weather
            feeling
            image
            note,
            latitude
            longitude
            author {
                _id
                name
                email
                picture
            }
            comments {
                text
                createdAt
                author {
                    name
                    picture
                }
            }
        }
    }
`

export const PIN_UPDATED_SUBSCRIPTION = gql`
    subscription {
        pinUpdated {
            _id
            createdAt
            weather
            feeling
            image
            note,
            latitude
            longitude
            author {
                _id
                name
                email
                picture
            }
            comments {
                text
                createdAt
                author {
                    name
                    picture
                }
            }
        }
    }
`

export const COMMENT_ADDED_SUBSCRIPTION = gql`
    subscription {
        commentAdded {
            _id
            createdAt
            weather
            feeling
            image
            note,
            latitude
            longitude
            author {
                _id
                name
                email
                picture
            }
            comments {
                text
                createdAt
                author {
                    name
                    picture
                }
            }
        }
    }
`