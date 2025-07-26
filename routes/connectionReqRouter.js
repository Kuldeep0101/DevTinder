const express = require("express");
const { verifyRoute } = require("../middleware/verifyRoute");
const connectionRequest = require("../src/models/connectionReqSchema");
const { User } = require("../src/models/user");
const requestRouter = express.Router();

//Send Connection request (Sender Side logic)
requestRouter.post(
  "/request/send/:status/:toUserId",
  verifyRoute,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const toUser = await User.findById(toUserId);
      if (!toUser)
        return res.status(404).json({ message: "User Does not Exist" });

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status either can be Ignored or Interested" });
      }

      if (toUserId.includes(fromUserId))
        return res
          .status(500)
          .json({ message: "Can't send connection Request to Self" });

      //If there is Existing Connection request
      const checkExistingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (checkExistingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already sent" });
      }

      const connectionRequestInstance = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestInstance.save();

      res.status(200).json({
        message: `${fromUserId.firstName} sent ${status} request ${toUser.firstName}`,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        messgae: "Error while Sending Connection Request",
        data: error.message,
      });
    }
  }
);

//Review Connection Request (Receiver Side Logic)
requestRouter.post(
  "/request/review/:status/:userId",
  verifyRoute,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const status = req.params.status;
      const allRequests = await connectionRequest.find({ status: status });
      
    } catch (error) {}
  }
);

module.exports = requestRouter;
