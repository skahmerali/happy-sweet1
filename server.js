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
    origin: [, 'http://localhost:3000', "https://sweet-app1.herokuapp.com"],
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

// var SERVICE_ACCOUNT = {
//     "type": "service_account",
//     "project_id": "tweeter0001-16162",
//     "private_key_id": "825f68f7141a00fa36a7a532406b53ce10109529",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLTbAnwTqDCzJb\nbuxAff2EPEzsB7us689uxKowtJ1d0sdlKGTHBWKpprFUnwNpeHnsmskNFn4bXadB\nbjvc7eyuC43xW+PrpBpvQ8dXaJsEoKy9fsfwcn0hlLWSrrLFspJx8UiIyg8Ynazt\ntmjQAun0d1RaApXXQteGmUr/HmGsZTaLgXfymHs2mFDEoX0ZB8wWJvFC7QlxSyX8\nb+BfnKUCI63fmJytpZKcukJU2GRwlBInrzMTrJ/79TceqAvYzfxMfUPIPtNArpeH\nf5eUR1U6TfMV3wTO9L0EBzTSqBJKhFgtkaGeBmhxAXf39tk+yI96yNBLYWxz/EO1\n8sv9kVXHAgMBAAECggEASi8c+kSt/ydUxrxhBN90ZI5EW1QvDVg2puqoV4Fwcs34\n6Fam/2Bdsh4bUw97BT9q7gVFG7t7ZKz13RBGU8WVuaSJtOqc7l1BMByBXsnS1wty\nPOtINdrxAhHrd4y7uxwACAfNOezROWA/u7X15QFLMWNhqj6LQrMnRfwlu5XweiEF\ntXJ+wAfpaQYcdPgBna0Eog6PK4aCE+B02bV9V4rTvdY1v960Kv3ez1gdAKlRLl/y\nFIGz3fanMb3XeGQVf4CYNohOo/Jsi3bvvbfbyEpdPyefVtYIjBmLxs4BjgvrAgvS\nMeuYxD9yHhbR2TZYZS09yPvvZ6jstSCNaQwAihjgcQKBgQD0XfCkdbDBKdu+Nx8S\nRgli2TN1iwFA19obQ/YD/ueTVr/rOxq1sS/I6B9PfktW3RNnCILFJx/VRooeBFFa\ncp1jErKFZQgaVqGet/INBsXN1qDaB20sSOegqoLvn96x4bUFbx2tx3O6QNhCZL6s\nP/+nylWxXKJByN7Rd3tzzQwKwwKBgQDU+1BsLcQ8IJFD92CPzYGLWq1JuZ2pnWsK\nDhzSqv+Va3sv9h+crNXxTRPpY1GT3QM+VRuY2tEezZnCTdWn4EpWItA7yJQ2+lPu\n7werZOkziAVot+P9SISJjwBWdE6ZnhG2lPDqZeO8Jwe+/AUCi1MC0Dmm7wAJAuH8\nG418pliwrQKBgBmsCMzuREx2vkwkdFIyI2hMEzjlCpOqWZKFuEHBNMjo0y6+Pdca\nrz93C1sJlJaikRhA76QQsSpxx67Rm05aPiibXT/gVlKWCVKoVniB3qP6SVm+b/y4\nCAV8BFdyPy4G3UKd4stP6duGVnHbLaDg9FXHTutcJPuuQ6JT4BdRUlOLAoGBANQa\nsD372ikTOfgY/YZY4EFa/aalfvlzNy1dXqEDAOPalWTvVQ4gJjRYUZMlgRGjkl5a\nPdCdYpOtqAoUn8m/GejsZLqVB940sLAMRnQPXBsgxFpEgH424R9pVanDzJ86B2Pw\nsniNHh68M/+kVozxGat8mV3BOSTARTRgcCiKNVtFAoGAd0pYwijqVuN0K4ylsY8A\nBW+x6jBNHEIPtJOT/sLTmIGAeKfxG+FrNG4qg7jPBYPFoLSvaJvWAnlLiOygSSIb\nQgdLm7z6j8Pm9ZYFTH4M8coykcc5/QLWrRNt1sMNbuMPdA4Ov16PwOetbxAC6jXe\nolXWm12hF4CGWse7/pdWWIY=\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-i3zg9@tweeter0001-16162.iam.gserviceaccount.com",
//     "client_id": "102636446531776556099",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i3zg9%40tweeter0001-16162.iam.gserviceaccount.com"
// }

var SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT)

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    DATABASE_URL: process.env.DATABASE_URL

    // DATABASE_URL: "https://tweeter0001-16162-default-rtdb.firebaseio.com/"

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







