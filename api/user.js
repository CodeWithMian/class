const router = require("express").Router();
const userModel = require("../model/user");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  try {
    if (!req?.body?.password) {
      res.status(400).json({
        success: false,
        message: "Enter Password",
      });
    }
    const hashpass = await bcrypt.hash(req.body.password, 10);
    const newusername = req.body.userName?.split(" ");

    if (newusername?.length >= 2) {
      res.status(400).json({
        success: false,
        message: "Spaces Are Not Allowed",
      });
    }
    const user = await userModel.create({ ...req.body, password: hashpass });

    res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        res.status(409).json({
          success: false,
          message: "Email Already in Use!",
        });
      }
      if (error.keyPattern?.phone) {
        res.status(409).json({
          success: false,
          message: "Phone Already in Use!",
        });
      }
      if (error.keyPattern?.userName) {
        res.status(409).json({
          success: false,
          message: "UserName Already in Use!",
        });
      }
      return;
    }

    // Required Fields Errors Handling
    if (error.message.split(",")[0]?.split(":")[2]?.trim()) {
      res.status(400).json({
        success: false,
        message: error.message.split(",")[0]?.split(":")[2]?.trim(),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName) {
      res.status(400).json({
        success: false,
        message: "Enter userName",
      });
    }
    if (!password) {
      res.status(400).json({
        success: false,
        message: "Enter Password",
      });
    }
    const founduser = await userModel.findOne({ userName: userName });
    if (!founduser) {
      res.status(400).json({
        success: false,
        message: "Invalid Credentiols",
      });
    } else {
      const validatepass = await bcrypt.compare(password, founduser.password);

      if (!validatepass) {
        res.status(400).json({
          success: false,
          message: "Invalid Credentiols",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Login Successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    if (error.message.split(",")[0]?.split(":")[2]?.trim()) {
      res.status(400).json({
        success: false,
        message: error.message.split(",")[0]?.split(":")[2]?.trim(),
      });
      return;
    }
  }
});
router.get("/get", async (req, res) => {
  try {
    var match = {};
    if (req.query.userName) {
      match.userName = new RegExp(req.query.userName, "i");
    }

    const allusers = await userModel.find(match, { userName: 1 });
    res.status(200).json({
      success: true,
      message: allusers,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:_id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(201).json({
      success: true,
      message: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
});
router.put("/:_id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    const hashpass = await bcrypt.hash(req.body.password, 10);

    const updateduser = await userModel.findByIdAndUpdate(user._id, {
      $set: { ...req.body, password: hashpass },
      
    }, {new: true});

    res.status(201).json({
      success: true,
      message: updateduser,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
});
router.delete("/:_id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const deleteduser = await userModel.findByIdAndDelete(req.params._id)
    res.status(201).json({
      success: true,
      message: "User Deleted ",
    });
  } catch (error) {
    
    res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
});
module.exports = router;
