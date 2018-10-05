const express = require('express')
const router = express.Router()
const multer  = require('multer')
const path = require('path')
const fs = require('fs')
// const deleteDirR = require ('../util/delete-dir-r')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>
      cb(null, 'uploads/'),
    filename: (req, file, cb) =>
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
})

const upload = multer({ storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Formatar Lista Telefônica', file: null })
})

router.post('/phoneList', upload.single('file'), async function(req, res) {
  var pathUploaded = req.file.path
  console.log(pathUploaded)

  const data = fs.readFileSync('./'+pathUploaded, 'utf-8')
  let phones = data.split('\r\n')

  let formattedPhones = await phones.map(phone => {
    return phone.replace('-','').replace('(','').replace(')','').replace(/\s/g,'')
  })

  formattedPhones = await formattedPhones.map(phone => {
    if (phone.substring(0,2)!=55){
      return '55'+phone
    }
    return phone
  })

  let buffer = formattedPhones.join('\r\n')
  console.log(buffer)

  fs.writeFile(pathUploaded, buffer, function(erro) {
      if(erro) {
          throw erro;
      }
      console.log("Lista corrigida foi salva!!!");
  });

  res.render('index',{title: 'Formatar Lista Telefônica', file: pathUploaded})
})

router.post('/download', async function(req, res){
  var file = './'+req.body.file;
  console.log(file);
  res.download(file); // Set disposition and send it.
  // await deleteDirR('./uploads/',(res,err) =>{
  //     if(err){
  //       console.log(err)
  //     }
  // })
});

module.exports = router
