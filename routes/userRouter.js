const express = require("express");
const { verifyRoute } = require("../middleware/verifyRoute");
const connectionRequest = require("../src/models/connectionReqSchema");
const { User } = require("../src/models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName";

//Get all the pending connection request of logged-in user
userRouter.get("/user/request/received", verifyRoute, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //Find All the "Interested" requests, which were sent to logged-in user
    const findPendingReq = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    if (!findPendingReq || findPendingReq.length === 0) {
      return res.status(400).json({
        message: "No Pending requests Found",
      });
    }

    res.status(200).json({
      message: "All pending (Interested) Requests-",
      data: findPendingReq,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
});

//Find All accepted Requests
userRouter.get("/user/connections", verifyRoute, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //Find all the request where logged-in user sent the response as interested and the another person also sent interested request

    const acceptedRequest = await connectionRequest
      .find({
        $or: [
          {
            fromUserId: loggedInUser._id,
            status: "accepted",
          },
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
      

    if (!acceptedRequest || acceptedRequest.length === 0) {
      return res.status(400).json("Not Connected with anyone");
    }

    const data = acceptedRequest.map((values) => {
      if (values.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return values.toUserId;
      }
      return values.fromUserId;
    });

    res.status(200).json({
      message: "All Connections",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
});

//Building feed API
userRouter.get("/user/feed", verifyRoute, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    //Finding page number and request numbers
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    // limit = limit > 30 ? 30 : limit;
    limit = Math.min(limit, 30);
    const skip = (page - 1) * limit;

    //Find all connection request (Sent + Received by logged in User)
    const fetchAllUsers = await connectionRequest
      .find({
        $or: [
          {
            toUserId: loggedInUser,
          },
          {
            fromUserId: loggedInUser,
          },
        ],
      })
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    fetchAllUsers.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

      //Hide all those users whom i sent the request or who sent me the req.+ hide my id as well
      const users = await User.find({
        $and: [
          {
            _id: {
              $nin: Array.from(hideUsersFromFeed), //dont show users from hideUsersFromFeed Set.
            },
          },
          {
            _id: {
              $ne: loggedInUser, //Dont show me in my feed
            },
          },
        ],
      })
        // .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

      res.send(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
