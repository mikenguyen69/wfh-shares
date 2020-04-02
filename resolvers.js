const { AuthenticationError, PubSub } = require('apollo-server')
const Pin = require('./models/Pin')
const pubsub = new PubSub()
const PIN_ADDED = "PIN_ADDED"
const PIN_UPDATED = "PIN_UPDATED"
const COMMENT_ADDED = "COMMENT_ADDED";

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

            console.log("in GetPins", args);
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

        editPin: authenticated(async (root, args, ctx) => {
            
            const input = args.input;
            const {pinId, weather, feeling, image, note} = input;

            const existingPin = await Pin.findOne({_id: pinId});
            let updatedValues = {};

            if (!existingPin) {
                console.error("Something wrong! Null existing", input);
                return;
            }

            if (existingPin.weather !== weather) 
                updatedValues = {...updatedValues, weather};

            if (existingPin.feeling !== feeling) 
                updatedValues = {...updatedValues, feeling};

            if (existingPin.image !== image) 
                updatedValues = {...updatedValues, image};
            
            if (existingPin.note !== note) 
                updatedValues = {...updatedValues, note};
            
            console.log('before edit', input, updatedValues);
            
            const pinUpdated = await Pin.findOneAndUpdate(
                { _id: input.pinId }, 
                updatedValues,
                { new: true }
            )
            .populate('author')
            .populate('comments.author');

            console.log('after edit', input, updatedValues, pinUpdated);

            pubsub.publish(PIN_UPDATED, {pinUpdated});

            return pinUpdated;
        }),
        
        createComment: authenticated(async (root, args, ctx) => {
            const newComment = {text: args.text, author: ctx.currentUser._id}

            const commentAdded = await Pin.findOneAndUpdate(
                { _id: args.pinId }, 
                { $push: {comments: newComment} },
                { new: true}
            )
            .populate('author')
            .populate('comments.author');
            
            console.log("Adding new comment", args, commentAdded);

            pubsub.publish(COMMENT_ADDED, {commentAdded});

            return commentAdded;
        }),
    },
    Subscription: {
        pinAdded: {
            subscribe: () => pubsub.asyncIterator(PIN_ADDED)
        },
        commentAdded: {
            subscribe: () => pubsub.asyncIterator(COMMENT_ADDED)
        },
        pinUpdated: {
            subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
        }
    }
}