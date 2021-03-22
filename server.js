var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require("path");
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const fs = require('fs')
const multer = require('multer')
const admin = require("firebase-admin");

var { userModle, shopCartModel, sweetOrdersModel } = require("./dbrepo/modles");
var authRoutes = require("./routes/auth")
console.log(userModle, shopCartModel, sweetOrdersModel)

var { SERVER_SECRET } = require("./core/index");

const PORT = process.env.PORT || 5000;


var app = express()
app.use(cors({
    origin: [, 'http://localhost:3000', "https://m-sweet-app.herokuapp.com/"],
    credentials: true
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/", express.static(path.resolve(path.join(__dirname, "./fontend/build"))));
app.use('/', authRoutes)

app.use(function (req, res, next) {
    console.log('cookie', req.cookies)

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    console.log("Asign value of token  ", req.cookies.jToken)

    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        console.log("decodedData .................>>>>>>>>>>  ", decodedData)
        if (!err) {
            const issueDate = decodedData.iat * 1000
            const nowDate = new Date().getTime()
            const diff = nowDate - issueDate

            if (diff > 300000) {
                res.status(401).send('Token Expired')

            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                })
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next()
            }
        } else {
            res.status(401).send('invalid Token')
        }

    });

})

////// Get profile and user data in user interface
////// Get profile and user data in user interface
////// Get profile and user data in user interface

app.get('/profile', (req, res, next) => {

    console.log(req.body)


    userModle.findById(req.body.jToken.id, "name email phone role cratedOn",
        function (err, data) {

            console.log("Get profile Err ", err)
            console.log("Get Profile Data ", data)
            if (!err) {
                res.send({
                    status: 200,
                    profile: data
                })
            } else {
                res.status(404).send({
                    message: "server err"
                })
            }

        })

})

//////Cart Upload Api
//////Cart Upload Api
//////Cart Upload Api
//////Cart Upload Api

const storage = multer.diskStorage({
    destination: './upload/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })

//==============================================

// var SERVICE_ACCOUNT = {}

var SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT)

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    // DATABASE_URL: process.env.DATABASE_URL

    DATABASE_URL: "https://tweeter0001-16162-default-rtdb.firebaseio.com/"

});

const bucket = admin.storage().bucket("gs://tweeter0001-16162.appspot.com/");

//==============================================

app.post("/uploadcart", upload.any(), (req, res, next) => {

    bucket.upload(
        req.files[0].path,

        function (err, file, apiResponse) {
            if (!err) {
                console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {

                    if (!err) {
                        // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        console.log(req.body.avalablity)
                        console.log("headerskdflasfjks ka data  ===================>>>>> ", req.headers.jToken.id)
                        console.log("headerskdflasfjks request headers  ===================>>>>> ", req.headers)
                        userModle.findById(req.headers.jToken.id, 'email role', (err, users) => {
                            console.log("Adminperson ====> ", users.email)

                            if (!err) {
                                shopCartModel.create({
                                    "title": req.body.title,
                                    "price": req.body.price,
                                    "availability": req.body.avalablity,
                                    "cartimage": urlData[0],
                                    "description": req.body.description
                                })
                                    .then((data) => {
                                        console.log(data)
                                        res.send({
                                            status: 200,
                                            message: "Product add successfully",
                                            data: data
                                        })

                                    }).catch(() => {
                                        console.log(err);
                                        res.status(500).send({
                                            message: "Not added, " + err
                                        })
                                    })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})


////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase
////// Get Products frrom Database in user Interfase


app.get('/getProducts', (req, res, next) => {
    shopCartModel.find({}, (err, data) => {
        console.log('hfhfhfhhfhfhfhhhhhhhhhhhhhhhhhhhhhhh', data)
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})


/////// Save order in Database
/////// Save order in Database
/////// Save order in Database
/////// Save order in Database
/////// Save order in Database


app.post("/order", (req, res, next) => {
    console.log("fsfsf", req.body)
    if (!req.body.orders || !req.body.total) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "orders": "order",
                "total": "12342",
            }`)
        return;
    }

    userModle.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("afafa", user)
        if (!err) {
            sweetOrdersModel.create({
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                email: user.email,
                orders: req.body.orders,
                total: req.body.total,
            }).then((data) => {
                res.status(200).send({
                    message: "Order have been submitted",
                    data: data
                })
            }).catch(() => {
                res.status(500).send({
                    message: "order submit error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })
})

app.get('/getorders', (req, res, next) => {
    sweetOrdersModel.find({}, (err, data) => {
        console.log("dlfsdjlaskdfj data datat tatdta + ", data)
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})

app.get('/admin/getorders/accepted', (req, res, next) => {
    console.log("status from admin status", req.body.status)
    sweetOrdersModel.find({ status: "Your Order Accepeted" }, (err, data) => {
        console.log("dlfsdjlaskdfj data datat tatdta + ", data)
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})

app.get('/admin/getorders/review', (req, res, next) => {
    console.log("status from admin status", req.body.status)
    sweetOrdersModel.find({ status: "Your Order in Review" }, (err, data) => {
        console.log("dlfsdjlaskdfj data datat tatdta + ", data)
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})


app.post('/admin/getorders/updatestatus', (req, res, next) => {
    console.log("status from admin status", req.body.status)
    console.log("status from admin status", req.body.id)
    sweetOrdersModel.findOne({ _id: req.body.id }, (err, match) => {
        console.log("Update data + ", match)
        console.log("Update data + ", err)
        if (match) {

            match.updateOne({ status: req.body.status }, (err, update) => {
                console.log("alaaaallallallalalal ", update)
                if (update) {
                    res.status(200).send({
                        message: 'Status Updated'
                    })
                } else {
                    res.status(401).send({
                        message: err
                    })
                }
            })

        } else {
            res.send(err)
        }
    })
})

app.post('/admin/getorders/confirmorder', (req, res, next) => {
    console.log("status from admin status", req.body.status)
    console.log("status from admin status", req.body.id)
    sweetOrdersModel.findOne({ _id: req.body.id }, (err, match) => {
        console.log("Update data + ", match)
        console.log("Update data + ", err)
        if (match) {

            match.updateOne({ status: req.body.status }, (err, update) => {
                console.log("alaaaallallallalalal ", update)
                if (update) {
                    res.status(200).send({
                        message: 'Status Updated'
                    })
                } else {
                    res.status(401).send({
                        message: err
                    })
                }
            })

        } else {
            res.send(err)
        }
    })
})







app.get('/admin/getorders/delivering', (req, res, next) => {
    sweetOrdersModel.find({ status: "your Order has been deliverd" }, (err, data) => {

        console.log("get Order in UserInterface", data)
        console.log("dlfsdjlaskdfj data datat tatdta + ", data)
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.status(304).send({
                message: 'you have not ordered Now'
            })
        }
    })
})




app.listen(PORT, () => {
    console.log("surver is running on : ", PORT)
});







