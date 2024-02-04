import bcrypt from "bcrypt";
import userModel from "../model/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// export async function validate(req, res, next) {
//   const { email, password, contact } = req.body;

//   const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

//   if (!email && !contact) {
//     res.status(500).send({
//       msg: "email or password required",
//       error: "",
//     });
//     return;
//   }

//   var passwordValidatePromise;
//   var ContactValidate;
//   var emailValidatePromise;

//   if (email) {
//     emailValidatePromise = new Promise(async (resolve, reject) => {
//       if (pattern.test(email)) {
//         resolve();
//       } else {
//         reject("Invalid email!!!");
//       }
//     });
//   }

//   if (contact) {
//     ContactValidate = new Promise((resolve, reject) => {
//       var digitRegex = /^\d+$/;

//       var isNumeric = digitRegex.test(contact);

//       var isValidLength = contact.toString().length === 10;
//       console.log(contact.length);

//       if (isNumeric && isValidLength) {
//         resolve();
//       } else {
//         reject("Invalid contact number!!!");
//       }
//     });
//   }

//   passwordValidatePromise = new Promise(async (resolve, reject) => {
//     // Minimum length of the password
//     var minLength = 8;

//     var uppercaseRegex = /[A-Z]/;
//     var lowercaseRegex = /[a-z]/;
//     var digitRegex = /\d/;

//     var isLengthValid = password.length >= minLength;
//     var hasUppercase = uppercaseRegex.test(password);
//     var hasLowercase = lowercaseRegex.test(password);
//     var hasDigit = digitRegex.test(password);

//     if (!isLengthValid) reject("Passwrd must be 6 characters long!!!");
//     if (!hasUppercase)
//       reject("Password must contain atleast one uppercase letter!!!");
//     if (!hasLowercase)
//       reject("Password must contain atleast one lowercase letter!!!");
//     if (!hasDigit) reject("Password must contain atleast one digit");

//     resolve();
//   });

//   Promise.all([emailValidatePromise, passwordValidatePromise, ContactValidate])
//     .then(() => {
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         msg: "invalid credentials",
//         error: err,
//       });
//     });
// }

export async function usernameVerify(req, res) {
  const { username } = req.body;
  console.log(req.body);
  const usernameExist = await userModel.findOne({ username });
  if (usernameExist) {
    console.log("Exists");
    return res.status(200).send("username alreadddy in use!!!");
  }
  return res.status(404).send("username available");
}

export async function register(req, res) {
  try {
    const { email, password, username } = req.body;
    console.log(username, email, password);
    if (!email && !username) {
      res.status(500).send({
        msg: "Enter either email or username",
        error: null,
      });
    }

    const userPromise = new Promise(async (resolve, reject) => {
      try {
        const existEmail = await userModel.findOne({ email });
        const existUsername = await userModel.findOne({ username });

        if (existEmail) reject("Email already exists!!!");
        if (existUsername) reject("Username already exists!!@");
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    userPromise
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const User = new userModel({
                password: hashedPassword,
                email,
                username,
              });

              User.save()
                .then(() => {
                  return res
                    .status(201)
                    .send("User registered successfully...");
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({
                    msg: "can't save the user",
                    error: err,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                msg: "cannot hash password",
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          msg: err,
          error: err,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "might be req.body error",
      error,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, username, password } = req.body;
    console.log(req.body);
    if (!email && !username) {
      res.status(500).send({
        msg: "enter email or username",
      });

      return;
    }

    const userPromise = new Promise((resolve, reject) => {
      try {
        const existEmail = userModel.findOne({ email });
        const existUsername = userModel.findOne({ username });

        if (email) {
          existEmail
            .then((user) => {
              resolve(user);
            })
            .catch((err) => reject("Email not registered!!!"));
        }

        if (username) {
          existUsername
            .then((user) => {
              resolve(user);
            })
            .catch((err) => reject("Username not registered!!!"));
        }
      } catch (error) {
        reject(error);
      }
    });

    userPromise
      .then(async (user) => {
        await bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).send({
                msg: "Wrong Password",
                error: "",
              });
            }

            const token = jwt.sign(
              {
                id: user._id,
                email: user.email,
                username: user.username || "",
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            console.log("login successful");
            return res.status(200).send({
              msg: "login successfully",
              username: user.username,
              token,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              msg: "Wrong Password !!!",
              error: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "user not found!!!",
          error: err,
        });
      });
  } catch (error) {
    res.status(500).send({
      msg: "login Controller try catch",
      error,
    });
  }
}

export async function getUser(req, res) {
  try {
    const { isAdmin } = req.user;
    if (isAdmin) {
      var { id, email, contact } = req.body;

      const query = {
        $or: [{ _id: id }, { email: email }, { contact: contact }],
      };

      userModel.findOne(query).then((user) => {
        return res.status(200).send({
          msg: "Successful",
          user,
        });
      });
    } else {
      var details = req.user;
      if (details) {
        return res.status(200).send({
          msg: "successful",
          user: details,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      msg: "user not found!!!",
      error,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { isAdmin } = req.user;
    var { name, profile } = req.body;
    var updates = {
      name,
      profile,
    };

    if (isAdmin) {
      const { email, contact, password } = req.body;
      var query = {
        $or: [{ email }, { contact }],
      };

      if (password) {
        var hashedpassword = bcrypt.hash(password, 12);
        updates = { ...updates, password: hashedpassword };
      }
      if (email) {
        updateData(req, res, { email }, updates);
      }
      if (contact) {
        updateData(req, res, { contact }, updates);
      }
      if (id) {
        updateData(req, res, { _id: id }, updates);
      }
    } else {
      var { id } = req.user;
      updateData(req, res, { _id: id }, updates);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "",
      error,
    });
  }
}

const updateData = (req, res, filters, updates) => {
  // update the data
  userModel
    .updateOne(filters, updates)
    .then(() => {
      return res.status(201).send({ msg: "User updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        msg: "User not found!!!",
        error: err,
      });
    });
};

const deleteData = (req, res, filters) => {
  const userExist = userModel.findOne(filters);
  if (userExist) {
    userModel
      .deleteOne(filters)
      .then(() => {
        return res.status(200).send("User deleted successfully!!!");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          msg: "Can't delete user",
          error: err,
        });
      });
  } else {
    return res.status(200).send({
      msg: "user Does not exist might be deleted already",
    });
  }
};

export async function deleteUser(req, res) {
  try {
    const { isAdmin } = req.user;
    if (isAdmin) {
      console.log("deleted by admin");
      const { email, contact, id } = req.body;

      if (email) {
        deleteData(req, res, { email });
      }
      if (contact) {
        deleteData(req, res, { contact });
      }
      if (id) {
        deleteData(req, res, { _id: id });
      }
    } else {
      console.log("deleted by user");
      const { id } = req.user;
      deleteData(req, res, { _id: id });
    }
  } catch (error) {
    return res.status(500).send({
      msg: "try catch error",
      error,
    });
  }
}

export async function generaterandomeText(req, res) {
  let result = "";
  const length = 10;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return res.status(200).send({
    msg: result,
  });
}
