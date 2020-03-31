const { AuthenticationError, PubSub } = require('apollo-server')
const Pin = require('./models/Pin')
const pubsub = new PubSub()
const PIN_ADDED = "PIN_ADDED"
const PIN_UPDATED = "PIN_UPDATED"

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in')
    }
    
    return next(root, args, ctx, info)
}

const getCurrentDate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-'+today.getDate();
    return date;
}

module.exports = {
    Query: {
        me: (root, args, ctx) => ctx.currentUser,
        getPins: async (root, args, ctx) => {
            const pins = await Pin.find({createdAt: {$gte: getCurrentDate()}})
                .populate('author')
                .populate('comments.author');
            return pins;
        }
    },
    Mutation: {
        createPin: authenticated(async (root, args, ctx) => {
            const newPin = await new Pin({
                ...args.input,
                author: ctx.currentUser
            }).save()

            const pinAdded = await Pin.populate(newPin, 'author')
            
            pubsub.publish(PIN_ADDED, {pinAdded})

            return pinAdded;

        }),
        
        createComment: authenticated(async (root, args, ctx) => {
            const newComment = {text: args.text, author: ctx.currentUser._id}

            const pinUpdated = await Pin.findOneAndUpdate(
                { _id: args.pinId }, 
                { $push: {comments: newComment} },
                { new: true}
            )
            .populate('author')
            .populate('comments.author');

            pubsub.publish(PIN_UPDATED, {pinUpdated});

            return pinUpdated;
        }),
    },
    Subscription: {
        pinAdded: {
            subscribe: () => pubsub.asyncIterator(PIN_ADDED)
        },
        pinUpdated: {
            subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
        }
    }
}