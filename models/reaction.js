// Define mongoose for schema creation.
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

console.log("Before schema setup (Reaction)");

// Build Reactions Schema.
const reactionSchema = new mongoose.Schema({
    reactionId:     { type: ObjectId, default: new ObjectId },
    reactionBody:   { type: String, required: true, maxlength: 280 },
    username:       { type: String, required: true },
    createdAt:      { type: Date, default: Date.now, get: (date) => date.toDateString() },
}, {
    toObject:       { populate: true },
    toJSON:         { getters: true }
});


console.log("After schema setup (Reaction)");

// Uses mongoose.model() to create model
const Reaction = mongoose.model('Reaction', reactionSchema);

// Error handler for seeding data.
const handleError = (err) => console.error(err);
 
// Only add the seeds if the collection is empty.
Reaction.find({}).exec((err, collection) => {
    if (collection.length === 0) {
        // Create JSON entry w/seeds.
        Reaction.create(
            {
                reactionBody: 'Wow what a thought.',
                username: 'Brian Zoulko',
            },
            {
                reactionBody: 'That was a great though',
                username: 'Steven Blomberg',
            },
            {
                reactionBody: 'Who thought of that!',
                username: 'Her She Bar',
            },
            {
                reactionBody: 'That was awesome!',
                username: 'Snikers',
            },
            (err) => (err ? handleError(err) : console.log('Created new Reaction (Seeds) document'))
        );
    }
});
  
module.exports = Reaction;