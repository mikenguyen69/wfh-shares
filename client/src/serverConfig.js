export const getUri = (prefix) => {
    let url = prefix;
    if (process.env.NODE_ENV === "production") {
        url += "://wfh-checkin.herokuapp.com/graphql";
    }
    else if (process.env.NODE_ENV === "staging") {
        url += "://wfh-checkin-staging.herokuapp.com/graphql";
    }
    else {
        url += "://wfh-checkin-test.herokuapp.com/graphql";
    }
    return url;
}