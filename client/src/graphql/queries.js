export const ME_QUERY = `
{
  me {
    _id
    name
    email
    picture
  }
}
`

export const GET_PINS_QUERY = `
{
    getPins {
        _id
        mood
        image
        note
        latitude
        longitude
        createdAt
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
                _id
                name
                picture
            }
        }
    }
}
`