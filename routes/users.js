var express = require('express');
var mongodb=require('mongodb').MongoClient;
var upload=require('./upload');
var db_str="mongodb://localhost:27017/zz1905"
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/home',(req,res)=>{
	res.send('hello home')
})

//注册
router.post('/register',(req,res)=>{
//	req.body  {}
	let username=req.body.username;
	let password=req.body.password;
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('infos',(err,coll)=>{
			coll.find({username:username}).toArray((err,data)=>{
				if(data.length>0){
					res.json({code:400,message:'用户名已存在!'})
					dbs.close()
				}else{
					coll.insert({username:username,password:password},()=>{
						res.json({code:200,message:'注册成功'})
						dbs.close()
					})
				}
			})
		})
	})
})

//登陆
router.post('/login',(req,res)=>{
//	req.body  == {username:xxx,password:xxx}
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('infos',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					req.session.name=data[0].username;
					res.json({code:200,message:'登陆成功'})
					dbs.close()
				}else{
					res.json({code:400,message:'用户名密码不一致'})
					dbs.close()
				}
			})
		})
	})
})

//博客
router.post('/boke',(req,res)=>{
//	req.body
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			coll.insert(req.body,()=>{
				res.json({code:200,message:'发布成功'})
				dbs.close()
			})
		})
	})
})

//上传图片
router.post('/uploadImg',(req,res)=>{
	upload(req,res)
})

//注册 
//　url /users/register
//传参
//	username
//	password
//请求类型
//	post
//返回值
//	{code:xx,message:xxx}


module.exports = router;
