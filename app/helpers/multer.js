const multer = require('multer');
const DIR = "./uploads/";

const storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, DIR);
    },
    filename: (req, file, next) => {
        const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-');
        next(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, next) => {
        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf"){
            next(null, true);
        }else{
            next(null, false);
            return next( new Error('Only .png, .jpg and .jpeg format allowed!'))
        } 
            
    }
})

    
module.exports = {
    upload
}