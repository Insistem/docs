# 常用命令

pwd 当前地址

vi 文件名   在vim中编辑这个文件

cd ~ 回到根目录

ll 显示当前文件夹的所有文件（包含文件大小 权限 修改时间）

  ls -a 显示当前文件夹的所有文件

sudo spctl --master-disable ： 显示文件已损坏，打不开时，在终端中输入这个命令即可

touch demo.js 可以快速创建文件

echo console > demo.js 创建一个文件 并且文件中默认有 console这些字符

rm -rf  node_modules/ 删除这个文件夹

~/.bash_history 记录上一次登录以前所执行过的命令

~  ：指的就是 /Users/mpy 地址

设置命令的别名： alias lm='ls -al'

ls -a 查看所有文件

 ls -al 用来查看当前目录下面所有文件（包含隐藏文件）及所有的文件属性

查看/usr/bin下面有多少以X开头的文件： ls -l /usr/bin/X*

通过man [命令名] 来查看这个命令的使用说明

ctrl+a / ctrl+e 分别让光标移动到整个命令串的最前面或最后面

用\（反斜杠）来转义回车，可以实现换行命令

echo $PATH 可以输出环境变量PATH

更改一个变量的值，只需要用等号=，例如：PATH=$PATH:/home/bin，可为PATH变量增加:/home/bin

$(command) 等同于 反撇号括起来的命令: 使用：进入目前内核的模块目录 cd /lib/modules/$(uname -r)/kernel/ ， 用于命令替换，允许将某个命令的输出结果赋值给变量。需要注意的是，反撇号括起来的范围内必须是能够被执行的命令，否则会出错

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200509003102426.png" alt="image-20200509003102426" style="zoom:50%;" />

env ：查看环境变量与常见环境变量说明

set: 观察所有变量（含环境变量与自定义变量）

linux系统的shell对大小写敏感，但是windows系统对大小写不敏感

mac中使用tree命令 - 是否可以尝试自己写一个tree命令

- https://blog.csdn.net/alicelmx/article/details/81188389

  `brew install tree`



