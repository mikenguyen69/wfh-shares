export const CREATE_PIN_MUTATION = `
    mutation($mood: Float!, $image: String, $note: String, $latitude: Float!, $longitude: Float!) {
        createPin(input: {
            mood: $mood,
            image: $image,
            note: $note,
            latitude: $latitude,
            longitude: $longitude
        }) {
            _id
            createdAt
            mood
            image
            note
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
    mutation($pinId: ID!, $mood: Float!, $image: String, $note: String) {
        editPin(input: {
            pinId: $pinId, 
            mood: $mood,
            image: $image,
            note: $note
        }) {
            _id
            createdAt
            mood
            note
            image
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
            mood
            image
            note
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