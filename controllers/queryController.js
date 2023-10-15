const Query = require("../models/queryModel");
const AppError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");
const { queryValidator } = require("./../validators/queryValidator");

exports.contactUs = catchAsync(async (req, res, next) => {
  // 1. Get data from body request and validate
  const validateBody = await queryValidator(req.body);
  if (!validateBody) {
    return next(new AppError(error.details[0].message, 400));
  }

  const { name, email, message } = validateBody;

  // 2. create a query
  const query = await Query.create({
    name: name,
    email: email,
    message: message
  });

  // await User.findOneAndUpdate(
  //   {id},
  //   { $push: { queries:query._id }},
  //   {new:true}
  // )

  // 3. send a email to this client

  // 4. send a response back to customer
  res.status(201).json({
    status: "success",
    data: {
      message: `Hey, ${query.name} your query is sent to us.`
    }
  });
});

exports.getQueries = catchAsync(async (req, res, next) => {
  const queries = await Query.find().select("-updatedAt").lean();

  res.status(200).json({
    status: "success",
    data: {
      queries
    }
  });

});