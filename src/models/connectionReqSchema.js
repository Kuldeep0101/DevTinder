const mongoose = require("mongoose");
const { User } = require("./user");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //Reference to the User Collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect Status Type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

///Check if User is sending the connection request to himself
// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     return resizeBy.status(500).json({message: "Can't send connection Request to Self"});
//   }
// next()
// });

const connectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequest;
