备注：1.下载的过程需要翻墙，可以确保有稳定的vpn

           2.webrtc服务器所需要的证书必须是第三方签名机构颁发的证书，自签证书不起作用

一、服务器组成
      1、AppRTC 房间服务器  https://github.com/webrtc/apprtc

      2、Collider  信令服务器  上边源码里自带
    
      3、CoTurn   coturn打洞服务器   https://github.com/coturn/coturn
    
      4、还需要自己实现一个 coTurn 连接信息（主要是用户名、密码的配置）获取接口，通常叫做 TURN REST API。

二、搭建roomserver
 1.下载房间服务器源代码
    sudo apt-get install git(可输入git version检查是否安装git环境，若有此步骤可忽略)

    如果获取失败，更新后再安装
    
    sudo apt-get update
    
    git clone https://github.com/webrtc/apprtc.git

2.安装依赖项
    sudo apt-get install nodejs

    sudo apt-get install npm
    
    sudo npm install -g npm
    
    sudo apt-get install nodejs-legacy
    
    sudo npm -g install grunt-cli

   切换至源码目录（有package.json）

   cd apprtc

   npm install（安装依赖模块在node_modules文件夹下）要翻墙，否则有错

   sudo apt-get install Python-webtest

   grunt build

 （ 注：npm命令用来安装nodejs的模块

  切换到Documents/apprtc 目录下

package.json定义了需要安装哪些依赖项，在package.json所在目录下执行npm install，安装依赖模块在这个目录的node_modudles文件夹下。
如果执行npm install -g则是安装在全局的地方，所有node项目都是可以使用这个module，安装路径可以通过npm config get prefix查看）
 编译之后在 Documents/apprtc目录下会多出out目录，下载Google App Engine SDK for Python（需要翻墙），首先确保系统已经有python，下载地址

        https://cloud.google.com/appengine/docs/standard/python/download

   下载完后配置环境变量

       sudo gedit  ~/.profile
    
       export PATH="$PATH:/home/apprtc/Downloads/google-cloud-sdk"
    
       export PATH="$PATH:/home/apprtc/Downloads/google-cloud-sdk/bin"
    
       source ~/.profile

３.修改配置文件
apprtc.py
搜make_pc_config(ice_transports)
config = {'iceServers': [{
               "url": "stun:windlazio.cn"
            },{
               "url": "turn:windlazio.cn",
               "username":"apprtc",
               "credential": "0xeddf0d3db115c58fd519c1bbd5430a32"
}]
一些资料要搜get_wss_parameters(request)，将wss:改为ws:，https:改为http:，是为了不要让客户端和浏览器去使用ssl连接，如果有第三方根证书的签名机构颁发的证书就可以不改这里。
if wss_tls and wss_tls == 'false':

    wss_url = 'ws://' + wss_host_port_pair + '/ws'
    
    wss_post_url = 'http://' + wss_host_port_pair

  else:

    wss_url = 'wss://' + wss_host_port_pair + '/ws'
    
    wss_post_url = 'https://' + wss_host_port_pair

constants.py
修改TURN_BASE_URL = 'https://windlazio.cn'，这个是coturn所对应的连接信息接口的地址
ICE_SERVER_BASE_URL = 'https://windlazio.cn'
CEOD_KEY = 'apprtc' ，这个和coturn  turnserver.conf 中static-auth-secret的值一致

WSS_INSTANCE_HOST_KEY = 'windlazio.cn'
WSS_INSTANCE_NAME_KEY = 'vm_name'
WSS_INSTANCE_ZONE_KEY = 'zone'
WSS_INSTANCES = [{
    WSS_INSTANCE_HOST_KEY: 'windlazio.cn:4432',
    WSS_INSTANCE_NAME_KEY: 'wsserver-std',
    WSS_INSTANCE_ZONE_KEY: 'us-central1-a'
}, {
    WSS_INSTANCE_HOST_KEY: 'windlazio.cn:4432',
    WSS_INSTANCE_NAME_KEY: 'wsserver-std-2',
    WSS_INSTANCE_ZONE_KEY: 'us-central1-f'
}]
WSS_INSTANCE_HOST_KEY将其改为信令服务器可访问的地址，不需要协议，没有URL。
切换到Documents/apprtc 目录下，重新编译
grunt build 
修改apprtc/src/app_engine/apprtc.py，修改后编译同步到apprtc/out/app_engine/apprtc.py 
修改apprtc/src/app_engine/constants.py，修改后编译同步到apprtc/out/app_engine/constants.py
4.运行roomserver
  dev_appserver.py   --host=windlazio.cn  ./out/app_engine

遇到的问题 

1. 按照网上的做法，在google_appengine根目录下找到dev_appserver脚本，就可以运行roomserver。但是运行失败，要执行以下步骤：
   google-cloud-sdk目录下 运行

   install.sh

   安装后初始化SDK

   google-cloud-sdk/bin/gcloud init（翻墙）

创建Google Account
gcloud init 
试gcloud auth list 的命令是否可用

切换至根目录（dev_appserver可全局使用），运行房间服务器：

       dev_appserver.py   --host=windlazio.cn  ./out/app_engine

2.若在~/Downloads/google-cloud-sdk/bin目录下运行 dev_appserver.py   --host=windlazio.cn  ./out/app_engine，就会出现如下错误:
 InvalidCWDError:Your current working directory is inside the cloud SDK install root:/home/apprtc/Downloads/google-cloud-sdk.
           In order to perform this update,run the command from outside of this directory.

切换至根目录下执行dev_appserver.py   --host=windlazio.cn  ./out/app_engine，终端信息：

 For the latest full release notes,please visit https://cloud.google.com/sdk/release_notes
提示Restart command，运行

$dev_appserver.py   --host=windlazio.cn  ./out/app_engine

TypeError:unsupported operand types for datetime,datetime and 'None type'
测试: grunt runPythonTests,出错：

SyntaxError:Use of const in strict build
错误提示：nodejs版本过低，升级nodejs

sudo npm install -g n

sudo n stable(获取稳定版)

node -v(查看nodejs版本是否升级成功)

运行dev_appserver.py   --host=windlazio.cn  ./out/app_engine成功。

3.客户端提示not access getUserMedia();
  电脑本身没有音视频设备，获取媒体数据失败

4.grunt build 出错：在grunt build时提示requests包找不到


      需要使用pip包安装requests库

  sudo apt-get pip
  pip install requests
5.npm install需要翻墙
  EC2北京区1.通过VPC连接VPN，要收费

                  2.通过改hosts文件，连接下载https://laod.cn/hosts/2017-google-hosts.html
    
                  3.EC2上配置vpn

 然后执行命令：sudo npm install -g

 三、搭建信令服务器
1.下载go源代码
拷贝collider源码 在home下创建文件夹collider_root，并在collider_root下创建src
            mkdir    ~/collider_root

           ~/colldier_root$   mkdir src
    
           然后修改将之前下载的apprtc源码中/apprtc/src/collider的三个文件夹拷贝到~/collider_root/src目录下
    
           cp  -r  ~/Documents/apprtc/src/collider    ~/collider_root/src

 下载version go1.4(至于为什么选择1.4的版本，见后面遇到的问题)
 https://golang.org/doc/install
           解压 tar -xf  go1.4.linux-amd64.tar.gz

           切换到解压目录下，/home/apprtc/go
    
            安装$ cd  go
    
            $ cd  src
    
            $ ./all.bash

2.设置环境变量
   sudo gedit  ~/.profile

   export GOPATH=GOPATH:~/collider_root

   export PATH="$PATH:/home/apprtc/go/bin:$GOPATH"

   source  ~/.profile

   终端输入 echo  $PATH ，echo $GOPATH可以检查是否设置成功

3.collider源码
修改collider源码
         进入GOPATH下src/collidermain/main.go修改，修改房间服务器地址为我们前面的房间服务器地址

         var roomSrv = flag.String("room-server", "https://windlazio.cn", "The origin of the room server")
    
         编辑$GOPATH/src/collider/collider.go，设置信令服务器所需要用的HTTPS的证书文件, 找到如下代码,注释后改为这样:
    
         e = server.ListenAndServeTLS("/usr/nginx/conf/ssl/apprtc.pem", "/usr/nginx/conf/ssl/apprtc.key")
    
         注：这里的nginx路径是后面搭建的反向代理服务器，两个服务器使用一个证书，这个证书必须是第三方签名机构颁发的证书，自签证书无效，证书申请必须先申请个域名。

编译collider源码
         切换到$GOPATH/src下（需翻墙）

         go get collidermain
    
         go install collidermain
    
         成功编译后会在collider_root目录下生成bin和pkg目录，执行文件在bin目录下

4.运行信令服务器
        ~/collider_root/bin/collidermain -port=4432 -tls=true

  -port = 表示 collider 监听的端口
   tls=true表示使用ssl加密链接
遇到的问题

 1.在执行 go get collidermain时，出现如下错误：

找不到 import path "collidermain"
未安装go命令，版本高于1.4
  go命令中 初始构建工具的脚本在$ GOROOT_BOOTSTRAP中查找现有的Go工具链。 如果未设置，则GOROOT_BOOTSTRAP的默认值为$ HOME / go1.4。

        不更改GOROOT_BOOTSTRAP这个值，所以下载的go版本必须是go1.4。下载好后执行./all.bash

参考链接：https://golang.org/doc/install/source

2.在执行 go get collidermain 出现错误：

  执行go get collidermain后，~/collider_root/src 目录下生成 GOPATH文件夹，生成golang.org,终端提示错误：

  # golang.org/x/net/websocket
  open GOPATH/src/golang.org/x/net/websocket/client.go: No such file or directory
  默认golang.org在GOPATH/src目录下，所以将golang.org复制到GOPATH目录下，当执行go get collidermain命令时就不会报错了。

3.在执行go get collidermain 出现错误：

collider/collider.go:56: undefined: tls.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
collider/collider.go:58: undefined: tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
 $GOPATH/src/collider 中的collider.go注释掉这两行代码，这个是加密套件，ubuntu中的openssl不支持

4.cannot open websocket

这是信令服务器没有启动。因为apprtc的信令服务器是基于websocket的，信令服务器没有启动，单存启动房间服务器时，客户端连入服务器会提示无法打开websocket.

这种无法打开，除了没有启动之外，还有可能是apprtc的源码中和信令服务器相关部分没有配置好，导致无法联系，相关配置文件要一致。

5.websocket error

  若使用自签证书浏览器不会通过，无法通信。

四、搭建coturn打洞服务器
1.下载源代码
wget http://turnserver.open-sys.org/downloads/v4.4.1.2/turnserver-4.4.1.2-debian-wheezy-ubuntu-mint-x86-64bits.tar.gz

解压  tar -xvfz  turnserver-4.4.1.2-debian-wheezy-ubuntu-mint-x86-64bits.tar.gz

         sudo apt-get update
    
         sudo apt-get install gdebi-core
    
         sudo gdebi *.deb

2.编辑配置文件
  (1).sudo gedit /etc/default/coturn，将TURNSERVER_ENABLED=1去掉注释
        source /etc/default/coturn   //保存

  (2).修改/etc/turnserver.conf之前预备工作，即turnserver.conf需要的内容

 turnadmin -k -u apprtc -r north.gov -p 123456 //生成md5值，保存
       其中apprtc是用户名，123456是密码

 创建my.db数据库， 将md5值与用户名写入到数据库中保存。
apprtc:0xeddf0d3db115c58fd519c1bbd5430a32

 生成coturn证书
           openssl生成签名证书

           sudo openssl req -x509 -newkey rsa:2048 -keyout /usr/local/etc/turn_server_pkey.pem-out/usr/local/etc/turn_server_cert.pem-days 99999 -nodes
    
       然后修改配置文件
    
       sudo gedit /etc/turnserver.conf,打开如下接口：
    
       listening-device=eth0   //桥接模式
       listening-port=3478
       tls-listening-port=5349                          
       listening-ip=192.168.2.101
       relay-device=eth0
       relay-ip=192.168.2.101
       external-ip=192.168.2.101
       relay-threads=0
       min-port=49152
       max-port=65535
       Verbose     //输出更多的log
       fingerprint     //打印信息
       lt-cred-mech
       use-auth-secret   //REST API 认证需要
       static-auth-secret=apprtc //设置用户名
       user=apprtc:0xeddf0d3db115c58fd519c1bbd5430a32 //用户名和MD5
       user=apprtc:123456  //明文，两个user二选一
       userdb=/home/apprtc/my.db
       stale-nonce
       cert=/etc/turn_server_cert.pem
       pkey=/etc/turn_server_pkey.pem
       no-loopback-peers  //安全模式，屏蔽 loopback, multicast IP地址的 relay
       no-multicast-peers  //安全模式，屏蔽 multicast IP地址的 relay
       pidfile="/var/run/turnserver.pid"
       mobility
       no-cli   //禁用本地 telnet cli 管理接口
       no-sslv3
    
     source /etc/turnserver.conf

  (3)修改/apprtc/src/web_app/js/util.js

  function requestIceServers(iceServerRequestUrl, iceTransports) { 
    return new Promise(function(resolve, reject){
     var servers = [{ credential: "0xeddf0d3db115c58fd519c1bbd5430a32", 
                              username: "apprtc", 
                              urls: [ "turn:windlazio.cn:3478?transport=udp",      
                                       "turn:windlazio.cn:3478?transport=tcp" ] 
                            },
                   {
                    urls:["stun:windlazio.cn:3478?transport=udp",
                            "stun:windlazio.cn:3478?transport=tcp"]
                       }];
      resolve(servers); 
});
}
更改~/Documents/apprtc/src/web_app/js/util.js，通过grunt build编译同步到 ~/out/app_engine/js/apprtc.debug.js

3.运行turnserver
 三种方法

turnserver -c /etc/turnserver.conf -v
log 保存在/var/tmp
终端也显示log信息
sudo service coturn start
sudo service coturn stop
log 保存在/var/tmp
终端不会显示log信息，打印一些状态信息
sudo turnserver -L 192.168.2.101 -o -a -b ~/my.db -f -r north.gov
log保存在/etc/log
终端只打印连接状态信息
遇到的问题

 1.启动coturn服务器，出错：

    cannot bind the Device eth0

  应该用sudo turnserver -c /etc/turnserver.conf -v超用户模式启动

2.网上搜索的相关资料配置turnserver.conf中的userdb = /etc/turnuserdb.conf，这个文件不是一个数据库，而这里需要的是一个数据库，要生成.db文件并进行配置。

五、搭建Nginx 反向代理服务器
dev_appserver.py默认监听8080端口，即不支持https（端口443），故搭建Nginx服务器

1.nginx安装包
下载       http://nginx.org/download/nginx-1.5.9.tar.gz
解压       sudo tar  -zxvf   nginx-1.5.9.tar.gz  -C  ~/Documents
安装依赖项
sudo  apt-get install libssl-dev
sudo  apt-get install libpcre3  libpcre3-dev
2.安装
 切换到解压目录下~/Documents/nginx-1.5.9

 运行：./configure  --prefix=/usr/nginx  --with-http_stub_status_module  --with-http_ssl_module

            make
    
            make install

 若成功则usr下的nginx文件夹就会生成，可执行文件在/usr/nginx/sbin目录下。

3.修改配置文件
sudo gedit  /usr/nginx/conf/nginx.conf

user  www-data; //配合php5-fpm使用
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';
    
    #access_log  logs/access.log  main;
    
    sendfile        on;
    #tcp_nopush     on;
    
    #keepalive_timeout  0;
    keepalive_timeout  65;
    
    #gzip  on;

upstream roomserver {

        server 192.168.2.101:8080;
}
server {
        listen 80 ;
        server_name windlazio.cn;
        return  301 https://$server_name$request_uri;
}
server {
        root /usr/nginx/html;
        index index.php index.html index.htm;
        listen 443 ;
        ssl on;
        # 域名为windlazio.cn的SSL证书文
        ssl_certificate      /usr/nginx/conf/ssl/apprtc.pem;
        ssl_certificate_key  /usr/nginx/conf/ssl/apprtc.key;
        server_name windlazio.cn;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        access_log  /usr/nginx/logs/apprtc.log;
        location / {
             
               proxy_pass http://roomserver$request_uri;
               proxy_set_header Host $host;
        }
        location ~ \.php$ {
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        }
}
}

4.启动nginx
       切换到可执行文件的目录/usr/nginx/sbin，  验证配置文件是否正确

sudo ./nginx -t
sudo ./nginx -s  reload     //重启nginx
ps -ef|grep nginx             //查看进程
pkill -q  nginx                  //停止所有进程
sudo kill -QUIT 进程号    //杀死进程号

5.coturn连接信息的接口（TURN REST API）
说明：1.TURN REST API 标准参考文档  ，REST API 是动态账号和密码， turn server和客户端交互时使用的。

          2.由于 coTurn 没有自带该接口，所以需要自行实现。关于该接口的实现方式，详细的内容请参考 coTurn原始文档。
    
          3.接口可通过php接口实现，并在coturn中配置

安装配置php
sudo apt-get install php5-fpm
sudo gedit /etc/php5/fpm/php.ini
设置cgi.fix_pathinfo=0
nginx.conf中第一行
#user nobody
去掉注释后改为
user www-data
否则访问https://windlazio.cn/index.php时页面会出错
index.php接口实现
<?php  

    $request_username = "";//$_GET["username"];  
    if(!isset($_GET["username"])) {  
        //echo "username == null";  
        //exit;  
    $request_username = "apprtc";
    }
    $request_key = "0xeddf0d3db115c58fd519c1bbd5430a32";//$_GET["key"];  
    $time_to_live = 600;  
    $timestamp = time() + $time_to_live;//失效时间  
    $response_username = $timestamp.":".$request_username;//$_GET["username"];  
    $response_key = $request_key;  
    if(empty($response_key))  
        $response_key = "apprtc";//constants.py中CEOD_KEY  
      
    $response_password = getSignature($response_username, $response_key);  
       
    $iceServer = new Response();  
    $iceServer->username = $response_username;  
    $iceServer->credential = $response_password;  
    $iceServer->ttl = 86400;  
    $iceServer->urls = array("turn:windlazio.cn:3478?transport=udp","turn:windlazio.cn:3478?transport=tcp","turn:windlazio.cn:3479?transport=udp","turn:windlazio.cn:3479?transport=tcp");  
    $str = json_encode($iceServer);
    $config = array("iceServers"=>[$iceServer,$iceServer]);//{"iceServers":"ff"};
    echo json_encode($config);     
    /**   
         * 使用HMAC-SHA1算法生成签名值   
         *   
     * @param $str 源串   
         * @param $key 密钥   
         *   
         * @return 签名值   
         */    
    function getSignature($str, $key) {    
        $signature = "";    
        if (function_exists('hash_hmac')) {    
            $signature = base64_encode(hash_hmac("sha1", $str, $key, true));    
        } else {    
            $blocksize = 64;    
            $hashfunc = 'sha1';    
            if (strlen($key) > $blocksize) {    
                $key = pack('H*', $hashfunc($key));    
            }    
            $key = str_pad($key, $blocksize, chr(0x00));    
            $ipad = str_repeat(chr(0x36), $blocksize);    
            $opad = str_repeat(chr(0x5c), $blocksize);    
            $hmac = pack(    
                    'H*', $hashfunc(    
                            ($key ^ $opad) . pack(    
                                    'H*', $hashfunc(    
                                            ($key ^ $ipad) . $str    
                                    )    
                            )    
                    )    
            );    
            $signature = base64_encode($hmac);    
        }    
        return $signature;    
       }    
      
    class Response {  
        public $username = "";  
        public $credential = "";  
        public $ttl = "";  
        public $urls = array("");  
    }  
?> 

返回JSON结果例如：


{"iceServers":[{"username":"1492579833:apprtc","credential":"nWU332E5+KQ2ermmzEEay4rsHag=","ttl":86400,"urls":["turn:windlazio.cn:3478?transport=udp","turn:windlazio.cn:3478?transport=tcp","turn:windlazio.cn:3479?transport=udp","turn:windlazio.cn:3479?transport=tcp"]},{"username":"1492579833:apprtc","credential":"nWU332E5+KQ2ermmzEEay4rsHag=","ttl":86400,"urls":["turn:windlazio.cn:3478?transport=udp","turn:windlazio.cn:3478?transport=tcp","turn:windlazio.cn:3479?transport=udp","turn:windlazio.cn:3479?transport=tcp"]}]}
启动/停止 php5-fpm
sudo service php5-fpm start/stop


遇到的问题

1.启动nginx时，错误：

 unknown directive “ssl” in /usr/nginx/conf/nginx.conf 

 安装开始执行这个命令：./configure  --prefix=/usr/nginx 说明该命令没有将ssl模块编译进nginx，配置文件中以ssl_开头 需要ssl模块的支持

 在安装编译时改用此命令：   ./configure  --prefix=/usr/nginx  --with-http_stub_status_module  --with-http_ssl_module 就解决了。

2.sudo ./nginx -s  reload 终端会报错

nginx: [error] open() "/usr/nginx/logs/nginx.pid" failed (2: No such file or directory)
 运行   sudo /usr/nginx/sbin/nginx -c /usr/nginx/conf/nginx.conf 就会生成pid文件。

3.启动roomserver有问题，最后查看虚拟机的ip没有固定，所以为了防止错误再次发生，应静态配置虚拟机的ip

  直接在虚拟机右上角系统设置中网络设置手动分配固定ip

4.用http连接时出错

  cannot create RTCPeerConnection

  是因为apprtc.py中make_pc_config "url":turn:apprtc@192.168.2.101,这里的apprtc应去掉

5.chrome显示pushState错误(Firefox 显示：Messages: Failed to start signaling: The operation is insecure.)

Messages:Failed to start signaling: Failed to execute 'pushState' on 'History' : A history state object with URL 'http://192.168.2.101/r/064289210'
cannot be created in a document with origin 'https://192.168.2.101'and URL 'https://192.168.2.101/'

这种错误大意是不能将http地址强制转成https

解决方案

apprtc通过grunt build编译好后在/apprtc/out/app_engine/js目录下找到 apprtc.debug.js文件搜索pushState,找到后将roomLink中的http强制转为https

roomLink=roomLink.substring("http","https");
(window.history.pushState({"roomId":roomId, "roomLink":roomLink}, roomId, roomLink);)再重新访问应该不会报错了。

6.访问https://windlazio.cn/index.php ，浏览器的页面内容却是空白

正常情况应该返回JSON结果例如：

{"iceServers":[{"username":"1492579833:apprtc","credential":"nWU332E5+KQ2ermmzEEay4rsHag=","ttl":86400,"urls":["turn:windlazio.cn:3478?transport=udp","turn:windlazio.cn:3478?transport=tcp","turn:windlazio.cn:3479?transport=udp","turn:windlazio.cn:3479?transport=tcp"]},{"username":"1492579833:apprtc","credential":"nWU332E5+KQ2ermmzEEay4rsHag=","ttl":86400,"urls":["turn:windlazio.cn:3478?transport=udp","turn:windlazio.cn:3478?transport=tcp","turn:windlazio.cn:3479?transport=udp","turn:windlazio.cn:3479?transport=tcp"]}]}
原因是nginx无法正确的将 .php 文件的地址传递给php5-fpm去解析，相当于php5-fpm接受到了请求，但这请求却指向一个不存在的文件，于是返回空结果。
为了解决这个问题，有两个途径（两个选其一）

1.nginx默认的fastcgi_params配置文件：
   vi /etc/nginx/fastcgi_params
   在文件的最后增加一行：
   fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;

2.nginx.conf中增加一行

  location ~ \.php$ {
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        }
关于这行的内容，多说几句，其中有两个参数：
$document_root 即是指网站的根目录，也就是我们在前面刚设置的 root /www;
$fastcgi_script_name 则指的是index .php 文件名

参考链接：http://www.jianshu.com/p/5018152350f8

7.在测试的过程中Android apk出现错误提示：parse JSON error，导致无法通信。

 在iOS 也有类似的情况，设置如下，错误消失

传给iOS turnRequestUrl =https://windlazio.cn/index.php?username=apprtc&key=0xeddf0d3db115c58fd519c1bbd5430a32

其中域名或ip，username和key是对应index.php配置好的。


六、附录
 curl -k  https://192.168.2.101 查看网页代码
 curl -v  https://192.168.2.101 查看打印信息
开启roomserver 切换到~/Documents/apprtc 下 grunt build重新编译
开启collider服务器切换到 ~/collider_root/src 重新编译
 go get collidermain
 go install collidermain
--------------------- 
作者：裸睡的蛐蛐 
来源：CSDN 
原文：https://blog.csdn.net/Stone_OverLooking/article/details/77197204 
版权声明：本文为博主原创文章，转载请附上博文链接！