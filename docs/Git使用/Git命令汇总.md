---
title: Git 常用命令
sidebar_position: 1
---

# Git 常用命令：一份够用的入门笔记

Git 可以把它理解成“给项目保存很多版本”。每次完成一小段工作，就提交一次；以后可以查看历史、回到旧版本，或者和别人一起开发。

## 一、第一次使用：设置身份

提交记录里会保存作者姓名和邮箱。它们只是提交信息，不是登录密码。

```shell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 查看当前配置
git config --global --list
```

如果只想给当前项目设置身份，可以去掉 `--global`。

## 二、创建或获取项目

### 从零创建本地仓库

```shell
mkdir learngit
cd learngit
git init
```

`git init` 会在当前目录创建 `.git` 文件夹。这个文件夹保存项目的提交历史，不要手动删除。

### 下载已有项目

```shell
git clone https://github.com/用户名/项目名.git
cd 项目名
```

## 三、日常保存：查看、暂存、提交

最常用的流程是：修改文件 → 查看状态 → 暂存 → 提交。

```shell
# 查看哪些文件被修改了
git status

# 暂存一个文件
git add README.md

# 暂存当前项目的所有新增、修改和删除
git add -A

# 保存暂存区的内容，并写一句说明
git commit -m "说明这次修改做了什么"
```

可以把暂存区理解成“这次准备保存的清单”。`git add` 只是把修改放进清单，真正生成版本要执行 `git commit`。

撤销暂存，但保留文件里的修改：

```shell
git restore --staged README.md
```

放弃文件中尚未提交的修改（谨慎使用，修改通常无法恢复）：

```shell
git restore README.md
```

## 四、查看历史和差异

```shell
# 简洁查看提交历史
git log --oneline

# 查看所有分支的历史图
git log --oneline --graph --all

# 查看尚未暂存的修改
git diff

# 查看已经暂存、准备提交的修改
git diff --staged

# 查看某一次提交具体改了什么
git show 提交ID
```

提交 ID 是提交记录前面那串字母和数字，通常写前几位就可以，只要能够唯一对应一条提交。

## 五、撤销和回到旧版本

### 只撤销工作区修改

```shell
git restore 文件名
```

### 撤销最近一次提交，但保留修改

适合“提交得太早了，想重新整理后再提交”：

```shell
git reset --soft HEAD~1
```

### 让当前分支和某个旧提交完全一致

```shell
git reset --hard 提交ID
```

`--hard` 会同时覆盖工作区和暂存区，未提交的修改可能丢失。多人协作或已经推送到远程的提交，不要随便使用它。

如果误操作，可以先查看 HEAD 移动记录：

```shell
git reflog
```

找到需要恢复的提交 ID 后，再根据情况使用 `git reset`。`reflog` 主要记录本机最近的操作，不能代替远程备份。

## 六、删除文件和忽略文件

删除文件并让 Git 记录这次删除：

```shell
git rm test.txt
git commit -m "删除 test.txt"
```

如果只是想让 Git 暂时不再跟踪某个文件，但保留本地文件：

```shell
git rm --cached 文件名
```

在项目根目录创建 `.gitignore`，写入不希望提交的文件或目录，例如：

```gitignore
*.log
.env
node_modules/
target/
```

已经提交过的文件不会因为后来加入 `.gitignore` 就自动消失；需要先用 `git rm --cached` 取消跟踪。

## 七、远程仓库

`origin` 只是远程仓库的默认别名，可以把它理解成“远程项目地址的简称”。

```shell
# 查看远程地址
git remote -v

# 添加远程仓库
git remote add origin https://github.com/用户名/项目名.git

# 第一次推送，并建立本地分支与远程分支的联系
git push -u origin main

# 后续推送
git push

# 拉取远程更新并尝试合并到当前分支
git pull

# 只下载远程信息，不修改当前文件
git fetch
```

实际使用的分支名可能是 `main`，也可能是 `master`，以项目当前分支为准，不要直接照抄。可以用下面的命令查看当前分支：

```shell
git branch --show-current
```

## 八、分支：多人协作时各自开发

分支就是从当前版本“分出一条独立路线”。常见做法是：`main` 保存稳定版本，其他分支开发新功能，完成后再合并回 `main`。

```shell
# 查看分支，当前分支前有 *
git branch

# 创建并切换到新分支（推荐写法）
git switch -c dev

# 切换到已有分支
git switch main

# 合并 dev 到当前分支
git merge dev

# 删除已经合并的本地分支
git branch -d dev
```

`git checkout` 仍然可以使用，但现在通常用 `git switch` 切换分支，用 `git restore` 恢复文件，含义更清楚。

如果合并时发生冲突，按这个顺序处理：

1. 执行 `git status`，找出冲突文件。
2. 打开文件，删除 `<<<<<<<`、`=======`、`>>>>>>>` 这些标记，并保留正确内容。
3. 执行 `git add 文件名`，告诉 Git 冲突已经解决。
4. 执行 `git commit`，完成这次合并。

不想继续合并时，可以执行：

```shell
git merge --abort
```

## 九、一个完整的日常示例

```shell
git switch -c feature-login

# 修改文件后
git status
git add -A
git commit -m "新增登录功能"

# 切回主分支并合并
git switch main
git merge feature-login

# 推送到远程仓库
git push
```

记住最核心的五个命令：

```shell
git status   # 看状态
git add      # 选择要保存的修改
git commit   # 保存一个版本
git push     # 上传到远程仓库
git pull     # 获取远程更新
```
