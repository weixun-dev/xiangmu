var express = require('express');
var async = require('async');
var mongodb=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var db_str="mongodb://localhost:27017/zz1905"
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {name:req.session.name,title:"mingzi"});
});
//登录
router.get('/login',(req,res)=>{
	res.render('login',{})
})
//注册
router.get('/register',(req,res)=>{
	res.render('register',{})
})

//人员信息
router.get('/personinfo',(req,res)=>{
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('info',(err,coll)=>{
			coll.find().toArray((err,data)=>{
				res.json({code:200,message:'成功',data:data})
				dbs.close()
			})
		})
	})
})
//退出登录
router.get('/relogin',(req,res)=>{
	req.session.destroy((err)=>{
		res.redirect('/')
	})
})
//发布博客 
router.get('/boke',(req,res)=>{
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
//			页码
			let pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
//			每页的数量
			let size=2;
//			总页数
			let page=0;
//			总数量
			let num=0
			async.series([
				function(callback){
					coll.find().toArray((err,result)=>{
						num=result.length;
						page=Math.ceil(num/size)  
						
//						上一页下一页
						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo
						dbs.close()
					})
					callback(null,'')
					
				},
				function(callback){
					coll.find().sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,info)=>{
						callback(null,info)
					})
				}
			],function(err,data){

				res.render('boke',{list:data[1],pageNo:pageNo,page:page})
				dbs.close()
			})

		})
	})

})


//详情

router.get('/detail',(req,res)=>{
	let id=ObjectId(req.query.id)
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				res.render('detail',{info:data[0]})
				dbs.close()
			})
		})
	})
	
	
})
module.exports = router;
