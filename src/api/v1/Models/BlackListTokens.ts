import mongoose from "mongoose";


interface BlackListTokenType {
    token: string
}

interface BlackListTokenDocument extends mongoose.Document {
    token: string
}

interface BlackListTokenModel extends mongoose.Model<BlackListTokenDocument>{
    build(blackListToken: BlackListTokenType): BlackListTokenDocument
}

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
})

blackListTokenSchema.statics.build = (blackListToken: BlackListTokenType) => {
    return new BlackListToken(blackListToken)
}

const BlackListToken = mongoose.model<any, BlackListTokenModel>('BlackListToken', blackListTokenSchema)

export default BlackListToken