import bcrypt from 'bcrypt';
import config from './config/config.js';
import passport from 'passport';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password);
export const serialize = (object,keys) =>{
    let serializedObject = Object.fromEntries(Object.entries(object).filter(pair=>keys.includes(pair[0])))
    serializedObject.id = object._id;
    return serializedObject;
}
export const cookieExtractor = req =>{
    let token = null;
    if (req && req.cookies)
    {
        token = req.cookies[config.jwt.cookie_name];
    }
    return token;
}
/*Middlewares */
export const passportCall = (strategy) =>{
    return async(req, res, next) =>{
        passport.authenticate(strategy,function(err, user, info) {
            console.log("info")
            console.log(info)
            console.log("user")
            console.log(user)
          if (err) return next(err);
          if (!user) {
             return res.send({error:info.messages?info.messages:info.toString()});
          }
          req.user = user;
          console.log(user)
          next();
        })(req, res, next);
      }
}

const s3 = new aws.S3({
    accessKeyId:config.aws.ACCESS_KEY,
    secretAccessKey:config.aws.SECRET
})


export const uploader = multer({
    storage:multerS3({
        s3:s3,
        bucket:'maxibucket',
        metadata:(req,file,cb)=>{
            cb(null,{fieldName:file.fieldname})
        },
        key:(req,file,cb)=>{
            cb(null,Date.now().toString()+file.originalname)
        }
    })
})