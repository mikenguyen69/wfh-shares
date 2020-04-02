export const CREATE_PIN_MUTATION = `
    mutation($weather: String!, $feeling: String!, $image: String, $note: String!, $latitude: Float!, $longitude: Float!) {
        createPin(input: {
            weather: $weather,
            feeling: $feeling,
            image: $image,
            note: $note,
            latitude: $latitude,
            longitude: $longitude
        }) {
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
        }
    }
`

export const DELETE_PIN_MUTATION = `
    mutation($pinId: ID!) {
        deletePin(pinId: $pinId) {
            _id
        }
    }
`

export const EDIT_PIN_MUTATION = `
    mutation($pinId: ID!, $weather: String!, $feeling: String!, $image: String, $note: String!) {
        editPin(input: {
            pinId: $pinId, 
            weather: $weather,
            feeling: $feeling,
            image: $image,
            note: $note
        }) {
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
        }
    }
`

export const CREATE_COMMENT_MUTATION = `
    mutation($pinId: ID!, $text: String!) {
        createComment(pinId: $pinId, text: $text) {
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