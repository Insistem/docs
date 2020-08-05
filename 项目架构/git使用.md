

### git pull 了其他分支的代码，有很多冲突，又不想处理，该如何撤销这步的操作

- `git reflog` : 命令查看你的历史变更记录，如下图所示：

- ```js
  e15c286 (HEAD -> dev-reconsitution) HEAD@{0}: reset: moving to e15c286
  e15c286 (HEAD -> dev-reconsitution) HEAD@{1}: checkout: moving from dev-固定首行+增加查询条件 to dev-reconsitution
  4add148 (origin/dev-固定首行+增加查询条件, dev-固定首行+增加查询条件) HEAD@{2}: commit: task#47521 收入分类 向上是
  绿色 向下是红色
  9c884d1 HEAD@{3}: commit: task#47521 收入分类 上升下降箭头颜色调换
  ```

- `git reset --hard HEAD@{n}`，（n是你要回退到的引用位置）回退，如上图就是``git reset --hard 40a9a83`

  `Git push -u origin master -f` 强行push

  

  ### 团队多人合作，分支管控，分public跟各个业务线，以OA为例

  ### Git强制覆盖分支操作

  > 前言：使用git进行合作时，有时会建立很多的分支，当分支两两合并完，想将代码移到主分支上时，如果采用merge的方式，往往会有很多冲突。比较推荐的一种方法是将分支内容强制覆盖到主分支（前提是主分支里的东西不再需要），效果类似于清空主分支并将其它分支复制粘贴过去。

  假设有一个分支test，要将这个分支的内容完全覆盖掉主分支master

  > git push origin test:master -f      *//将test分支强制（-f）推送到主分支master*

  > 
  >
  > git checkout master             *//将当前分支切换到主分支*
  >
  > git reset --hard test              *//将主分支重置为test分支*
  >
  > git push origin master -f       *//将重置后的master分支强制推送到远程仓库*

### 将本地的内容（未与远程仓库建立连接）推到远程的建好的仓库

- `git init`
- `git add .`
- `git commit -m 'first commit'`
- `git push -u origin master` : 增加-u）,第一次提交增加`-u（--set-upstream`）属性，以后就直接`git push`就行了，因为已经将本地与远程仓库建立了联系

### 将本地的内容（已经与远程仓库建立连接）推到远程的建好的仓库，推到远程不同分支的仓库上

- `git push origin dev-1.0:dev`: 将本地的`dev-1.0`分支的代码，提交到远程的`Dev`分支

#### 更改远程仓库的称呼

- 一般不设置，origin代表的就是远程的仓库`<remote>`
-  If you run `git clone -o booyah` instead, then you will have `booyah/master` as your default remote branch

#### 远程仓库新开了一个分支（例如叫：dev-1.1），然后在这个分支上开发

- 只需要在本地运行`git checkout --track origin/dev-1.1`，就在本地新建了一个分支，并且与远程仓库的`dev-1.1`建立联系
- 或者本地不想叫那个名字，可以使用`git checkout -b demo origin/dev-1.1`
- 或者本地新建一个分支，然后与远程分支建立联系
  - `git branch dev-1.1`
  - `git branch -u origin/serverfix`



### Git global setup

`git config --global user.name "mapengyang" `

 `git config --global user.email "mapengyang@ky-tech.com.cn" `

### Create a new repository

`git clone git@gitlab.ky-tech.com.cn:kuasheng-h5/fms-organization-cost.git `

 `cd fms-organization-cost `

 `touch README.md `

 `git add README.md `

 `git commit -m "add README" `

 `git push -u origin master `

### Existing folder

`cd existing_folder `

 `git init `

 `git remote add origin git@gitlab.ky-tech.com.cn:kuasheng-h5/fms-organization-cost.git `

 `git add . `

 `git commit -m "Initial commit" `

 `git push -u origin master `

### Existing Git repository

 `cd existing_repo `

`git remote add origin git@gitlab.ky-tech.com.cn:kuasheng-h5/fms-organization-cost.git `

`git push -u origin --all `

`git push -u origin --tags`

- 如果这个本地仓库已经关联了一个远程分支为`origin`，想要再关联一个新的远程分支，这里就不能再叫 `origin`了
- <img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200525103231394.png" alt="image-20200525103231394" style="zoom:50%;" />

拉取远程分支，并且在本地创建一个对应的分支

`git checkout -b AP-2020.06.18-mpy --track origin/AP-2020.06.18-mpy`



#### 记Git报错-refusing to merge unrelated histories

产生问题背景： 本地新建了一个文件夹，远程新建了一个仓库，现在需要把这两个仓库建立联系

参考文章： https://blog.csdn.net/u012145252/article/details/80628451

```js
git remote add origin https://github.com/Insistem/learn-day

git remote -v // 查看远程仓库

git pull origin master --allow-unrelated-histories  // 发现可以在pull命令后紧接着使用--allow-unrelated-history选项来解决问题（该选项可以合并两个独立启动仓库的历史）

git push --set-upstream origin master 等同于简写的 git push -u origin master
```



