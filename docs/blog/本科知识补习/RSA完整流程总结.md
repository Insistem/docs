# RSA完整流程总结

## 1.1-RSA加密介绍

* 1.RSA公钥加密算法是1977年由罗纳德·李维斯特（Ron Rivest）、阿迪·萨莫尔（Adi Shamir）和伦纳德·阿德曼（Leonard Adleman）一起提出的。1987年7月首次在美国公布，当时他们三人都在麻省理工学院工作实习。RSA就是他们三人姓氏开头字母拼在一起组成的。

* 2.RSA是目前最有影响力和最常用的公钥加密算法，它能够抵抗到目前为止已知的绝大多数密码攻击，已被ISO推荐为公钥数据加密标准。

* 3.今天只有短的RSA钥匙才可能被强力方式解破。到2008年为止，世界上还没有任何可靠的攻击RSA算法的方式。只要其钥匙的长度足够长，用RSA加密的信息实际上是不能被解破的。但在分布式计算和量子计算机理论日趋成熟的今天，RSA加密安全性受到了挑战和质疑。

* 4.RSA算法基于一个十分简单的数论事实：将两个大质数相乘十分容易，但是想要对其乘积进行因式分解却极其困难，因此可以将乘积公开作为加密密钥。

*** 也就是说RSA加密只要你的钥匙够长,是无解的***

## 1.2-关于公钥和私钥

* 参考网址<http://www.blogjava.net/yxhxj2006/archive/2012/10/15/389547.html>

* 1.公钥是谁所持有的？
    * 服务器和客户端

* 2.私钥是谁所持有的？
    * 服务器

* 3.哪一把钥匙用来加密？
    * 公钥

* 4.哪一把钥匙用来解密？
    * 私钥

## 1.3-RSA加密完整流程

* ***服务端需要准备两把钥匙，公钥和私钥***
    * 百度搜索：openssl.exe工具
        * 安装包路径默认在:`C:\OpenSSL-Win64\bin`

* 1.客户端需要加密时，先向服务端发起一个请求，请求RSA的公钥

* 2.服务端获取到请求之后，生成公钥，返回给客户端

* 3.客户端拿到公钥之后，使用公钥加密明文

* 4.客户端将公钥加密之后的密文发给服务器

* 5.服务端获取客户端密文，使用私钥解密可以得到明文

## 1.4-服务端生成公钥私钥流程

1.打开终端生成公私钥
    * `genrsa -out rsa_private_key.pem 1024`
        * 如果是java开发者则需要将私钥转成PKCS8格式,nodejs可以不用
            * `pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -nocrypt -out rsa_private_key_pkcs8.pem`

* 2.生成公钥 `rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem`

* 3.退出程序    
    * `exit`:方便下一次继续生成，每一次进入和退出生成的公私钥都是不一样的

* 4.将刚刚生成的两个公私钥证书放入项目目录
    * 使用文件读写来读取公钥和私钥

## 1.5-服务端编写一个rsa模块用于RSA加密和解密

* 修改crypto的解密填充模式，并添加用于AES加密的钥匙
    * 关于rsa加密的填充模式可以参考这篇博客:http://www.cnblogs.com/lzl-sml/p/3501447.html

```javascript

//导入nodejs内置加密模块
var crypto = require('crypto');
//文件读写模块
var fs = require('fs');

//读取私钥pem证书文件
var privatePem = fs.readFileSync('./rsa_private_key.pem');
//读取公钥pem证书文件
var publicPem = fs.readFileSync('./rsa_public_key.pem');
//将公私钥转化为字符串
var prikey = privatePem.toString();
var pubkey = publicPem.toString();

///< rsa加解密  

///< 公钥加密  

var rsa = module.exports;

//浏览器只需要公钥
rsa.encrypt = function(){
    return pubkey;
};

//解密
rsa.decrypt = function(data){

    //1.由于jsencrypt加密之后是base64格式，所以这里需要转成base64格式的二进制
    var buff = new Buffer(data,'base64');
//     //使用私钥解密 第一个参数是私钥 第二个参数是密文（二进制）
    //console.log(crypto.constants);
    //padding是设置加密填充模式（文本不足时的填充），jsencrypts使用的是RSA_PKCS1_PADDING模式
    //（不同的模式对同样的字符串加密会得到不同的密文，所以使用什么模式加密就必须使用什么模式解密）
     var dedata = crypto.privateDecrypt({key:prikey,padding:crypto.constants.RSA_PKCS1_PADDING},buff);
console.log('解密' + dedata.toString());

     return dedata.toString();
};


//将base64格式钥匙转成16进制
// var cipher = crypto.createCipher('blowfish', publicPem);
// console.log(cipher.update(key,'base64','hex'));

//AES加密钥匙
rsa.AESKey = 'welcom to itheima learn big qianduan';

```

## 1.6-客户端RSA公钥加密流程

* 前端rsa加密我们需要借助npm第三方:https://www.npmjs.com/package/jsencrypt
    * npm install jsencrypt
        * 该第三方可以使用npm来安装，但是该第三方只能用于网页端，不支持node端

* 使用我们项目案例的注册界面来演示 

```html

<script src="/node_modules/jquery/dist/jquery.js"></script>
  <!-- rsa加密 -->
  <script src="/node_modules/jsencrypt/bin/jsencrypt.js"></script>
  <script>

    $('#form').on('submit', function (e) {
      e.preventDefault();
      //1.先获取公钥
      $.ajax({
          url: '/publicKey',
          type: 'get',
          dataType: 'json'
          }).then(function (data) {
            console.log(data.key);

          // 2.使用服务器返回的公钥加密 

          //2.1创建encrypt对象
          var encrypt = new JSEncrypt();
          //2.2设置公钥
          encrypt.setPublicKey(data.key);
          //2.3开始加密  这里动态获取密码输入框文本，原因是什么？
          var encrypted = encrypt.encrypt($('[name="password"]').val());
          //设置密码框的值为密文
          $('[name="password"]').val(encrypted);

          console.log(encrypted);
          //此时再获取表单数据就是已经加密好的数据
          //3.再一次提交注册表单
          $.ajax({
            url: '/register',
            type: 'post',
            data: $('#form').serialize(),
            dataType: 'json'
          }).then(function (data) {

            var err_code = data.err_code;
            if (err_code === 2000) {
              //暂时先跳转回首页
              window.location.href = '/';
            } else if (err_code === 2001) {
              window.alert(data.err_message);
            }
            else{
               window.alert(data.err_message);
            }
          });
      });

    });

  </script>

```

## 1.7-服务端RSA私钥解密流程

* 1.处理路由，如果请求路径是:`/publicKey`，返回公钥

* 2.处理路由：如果请求路径是：`/register`
    * （1）获取bosy数据
    * （2）将bosy的password使用私钥解密
        * RSA加密的最大特点就是只能用公钥加密，只能用私钥解密
    * （3）存入数据库

