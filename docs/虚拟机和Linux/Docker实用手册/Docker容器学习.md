---
title: Docker 容器学习
sidebar_position: 1
---

# Docker 容器学习

这篇笔记只介绍 Docker 安装完成后的日常管理。安装 Docker 可以参考同目录下的 [Debian 安装 Docker](./Debian安装Docker.md)。

## 一、先理解 4 个名词

可以把 Docker 想成一个“运行应用的工具箱”：

| 名词            | 通俗理解                   |
| ------------- | ---------------------- |
| 镜像（image）     | 应用的安装模板，例如 nginx、mysql |
| 容器（container） | 镜像真正运行起来后的实例           |
| 数据卷（volume）   | 单独保存数据的地方，容器删除后数据仍可保留  |
| 网络（network）   | 容器之间互相访问的通道            |

一个镜像可以创建很多个容器。同一个容器也可以连接多个网络、挂载多个数据卷。

## 二、命令的基本格式

现代 Docker 命令通常按对象分组：

~~~shell
docker 对象 动作 参数
~~~

例如：

~~~shell
docker image ls       # 查看镜像
docker container ls   # 查看运行中的容器
docker volume ls      # 查看数据卷
docker network ls     # 查看网络
~~~

为了兼容旧教程，下面也会写出常见短命令，例如 docker images、docker ps。它们仍然可以使用，但分组写法更容易看懂。

查看 Docker 是否正常工作：

~~~shell
docker version
docker info
docker run --rm hello-world
~~~

如果当前用户没有权限，可以在命令前加 sudo，或者按系统说明把用户加入 docker 用户组。

## 三、镜像管理

### 1. 下载和查看镜像

~~~shell
# 从镜像仓库下载镜像
docker pull nginx:alpine

# 查看本地镜像
docker image ls
# 旧写法：docker images

# 只显示镜像 ID
docker image ls -q

# 查看一个镜像的详细信息
docker image inspect nginx:alpine

# 查看镜像是怎样一层层构建出来的
docker image history nginx:alpine
~~~

镜像名通常写成：

~~~text
仓库名/镜像名:标签
~~~

例如 nginx:alpine。不写标签时通常使用 latest，但生产环境最好写明确版本，例如 nginx:1.27-alpine，避免同一个标签内容发生变化。

### 2. 构建、改名和删除镜像

当前目录有 Dockerfile 时，可以这样构建：

~~~shell
# -t 为镜像命名，最后的 . 表示使用当前目录作为构建上下文
docker build -t my-app:1.0 .

# 给镜像增加一个新名字或标签，不会复制一份镜像
docker image tag my-app:1.0 username/my-app:1.0

# 删除镜像
docker image rm my-app:1.0

# 清理没有被使用的悬空镜像
docker image prune
~~~

删除镜像失败时，通常是因为仍有容器依赖它。先删除相关容器，再删除镜像；确认无误后也可以使用 -f 强制删除。

### 3. 上传和备份镜像

~~~shell
# 登录镜像仓库
docker login

# 上传镜像，前提是镜像名包含自己的仓库用户名
docker push username/my-app:1.0

# 退出登录
docker logout

# 把镜像保存为 tar 文件，适合离线传输
docker image save -o my-app.tar my-app:1.0

# 从 tar 文件恢复镜像
docker image load -i my-app.tar
~~~

save/load 保存和恢复的是镜像；不要和容器的 export/import 混用。

## 四、容器管理

### 1. 创建并运行容器

最常用的命令是 docker run：

~~~shell
# 后台运行一个 Nginx 容器
docker run -d --name web -p 8080:80 nginx:alpine
~~~

这条命令的意思：

| 参数 | 作用 |
| --- | --- |
| -d | 后台运行 |
| --name web | 给容器取名为 web |
| -p 8080:80 | 把主机的 8080 端口转到容器的 80 端口 |
| nginx:alpine | 使用哪个镜像 |

访问 http://localhost:8080 就可以看到 Nginx 页面。

常用的 docker run 参数：

~~~shell
# 前台运行，按 Ctrl+C 停止
docker run --name test nginx:alpine

# 容器停止后自动删除，适合临时测试
docker run --rm nginx:alpine

# 设置环境变量
docker run -d --name app -e APP_ENV=prod my-app:1.0

# 挂载数据卷
docker run -d --name db -v mysql-data:/var/lib/mysql mysql:8.4

# 绑定主机目录
docker run -d -v ./data:/app/data my-app:1.0

# 加入指定网络
docker run -d --name api --network app-net my-api:1.0

# 容器退出后自动重启，主机重启后也继续运行
docker run -d --restart unless-stopped my-app:1.0

# 限制容器最多使用 1 个 CPU 和 512 MB 内存
docker run -d --cpus=1 --memory=512m my-app:1.0
~~~

如果只想创建容器、暂时不启动，可以使用：

~~~shell
docker container create --name web -p 8080:80 nginx:alpine
docker container start web
~~~

### 2. 查看容器

~~~shell
# 查看运行中的容器
docker container ls
# 旧写法：docker ps

# 查看所有容器，包括已经停止的
docker container ls -a
# 旧写法：docker ps -a

# 只显示容器 ID
docker container ls -aq

# 查看容器详细配置、网络和挂载信息
docker container inspect web

# 查看容器中正在运行的进程
docker container top web

# 查看端口映射
docker container port web
~~~

### 3. 启动、停止和删除容器

~~~shell
# 启动已经停止的容器
docker container start web

# 正常停止：给应用一段时间收尾
docker container stop web

# 重新启动
docker container restart web

# 修改容器名称
docker container rename web web-old

# 立即终止，通常只在程序无响应时使用
docker container kill web

# 暂停和恢复容器内的进程
docker container pause web
docker container unpause web

# 修改运行中容器的资源限制
docker container update --memory=1g web

# 删除已经停止的容器
docker container rm web

# 强制停止并删除运行中的容器
docker container rm -f web

# 删除所有已经停止的容器
docker container prune
~~~

容器删除后，容器内部未挂载出来的数据通常也会一起消失。重要数据应放在数据卷或主机目录中。

### 4. 查看日志和进入容器

~~~shell
# 查看全部日志
docker container logs web

# 持续查看最新日志
docker container logs -f --tail 100 web

# 查看容器资源使用情况
docker container stats web

# 在运行中的容器里执行命令
docker container exec -it web sh
~~~

有些镜像没有 bash，这时使用 sh。退出容器内的 shell：

~~~shell
exit
~~~

exec 是“新开一个命令进入容器”；attach 是“连接到容器主进程”，日常排错通常优先使用 exec。

如果需要连接到容器的主进程，可以使用：

~~~shell
docker container attach web
~~~

退出 attach 时，通常按 Ctrl-P、Ctrl-Q 可以脱离连接而不停止容器；不要直接按 Ctrl-C，除非你确实想结束主进程。

### 5. 复制文件、查看变化和备份容器

~~~shell
# 从容器复制到主机
docker container cp web:/etc/nginx/nginx.conf ./nginx.conf

# 从主机复制到容器
docker container cp ./nginx.conf web:/etc/nginx/nginx.conf

# 查看容器相对镜像增加、修改或删除了哪些文件
docker container diff web

# 等待容器退出，并返回退出码
docker container wait web

# 查看容器最近一次退出码等信息
docker container inspect web
~~~

如果确实需要把容器当前状态保存成新镜像：

~~~shell
docker container commit web web-backup:1.0
~~~

更推荐把修改写进 Dockerfile，然后重新 docker build，这样过程可重复、也更容易维护。

## 五、数据卷管理

数据卷适合保存数据库、上传文件等重要数据。容器删掉后，数据卷不会自动删除。

~~~shell
# 创建数据卷
docker volume create app-data

# 查看所有数据卷
docker volume ls

# 查看数据卷实际存放位置等信息
docker volume inspect app-data

# 使用数据卷
docker run -d --name db -v app-data:/var/lib/mysql mysql:8.4

# 删除数据卷（必须没有容器正在使用）
docker volume rm app-data

# 删除没有被任何容器使用的数据卷
docker volume prune
~~~

-v 主机目录:容器目录 是绑定挂载；-v 数据卷名:容器目录 是命名数据卷。数据库通常更适合使用命名数据卷。

## 六、网络管理

自定义网络可以让容器通过容器名互相访问。例如，api 容器可以直接访问 db:3306。

~~~shell
# 查看网络
docker network ls

# 创建自定义网络
docker network create app-net

# 查看网络中的容器和配置
docker network inspect app-net

# 创建容器时加入网络
docker run -d --name db --network app-net mysql:8.4

# 把已有容器接入网络
docker network connect app-net api

# 断开容器与网络的连接
docker network disconnect app-net api

# 删除网络
docker network rm app-net

# 删除没有使用的网络
docker network prune
~~~

容器之间加入同一个网络后，可以使用容器名访问；从主机访问容器服务，仍然需要使用 -p 发布端口。

## 七、资源占用和统一清理

~~~shell
# 查看 Docker 占用的磁盘空间
docker system df

# 清理没有使用的容器、网络、悬空镜像和构建缓存
docker system prune

# 连同没有被使用的镜像一起清理（更彻底，谨慎使用）
docker system prune -a

# 清理构建缓存
docker builder prune
~~~

清理前先执行 docker system df。不要为了“看起来干净”直接使用 -a，它可能删除以后还想复用的镜像。

## 八、故障排查常用命令

~~~shell
# Docker 服务和版本信息
docker version
docker info

# 查看命令帮助
docker help
docker run --help

# 查看容器是否在运行、退出原因和日志
docker ps -a
docker inspect 容器名
docker logs 容器名

# 查看容器端口、网络和资源使用
docker port 容器名
docker stats 容器名
docker top 容器名

# 查看 Docker 实时事件
docker events
~~~

常见问题的排查顺序：先看 docker ps -a，再看 docker logs 容器名，最后用 docker inspect 容器名 查看端口、环境变量、挂载和退出状态。

## 九、镜像仓库相关命令

~~~shell
# 搜索公开镜像
docker search nginx

# 登录、退出镜像仓库
docker login
docker logout

# 下载、上传镜像
docker pull nginx:alpine
docker push username/my-app:1.0
~~~

不要把密码直接写在命令行或提交到代码仓库。登录凭据会由 Docker 保存到本机配置中，公共电脑上使用后应及时退出。

## 十、Docker Compose 常用命令

Compose 用一个 compose.yaml 文件描述多个容器，例如应用、数据库和缓存，然后统一启动和停止。

~~~shell
# 根据 compose.yaml 创建并后台启动服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看所有服务日志
docker compose logs -f

# 只看某个服务的日志
docker compose logs -f api

# 在某个服务容器中执行命令
docker compose exec api sh

# 构建服务镜像
docker compose build

# 拉取 compose 文件中指定的镜像
docker compose pull

# 停止并删除容器、网络（默认不删除数据卷）
docker compose down

# 停止并删除容器、网络，以及 Compose 声明的卷
docker compose down -v

# 重启服务
docker compose restart

# 只启动或停止已有服务，不删除容器
docker compose start
docker compose stop

# 删除已经停止的服务容器
docker compose rm

# 临时运行某个服务，并覆盖它的默认命令
docker compose run --rm api sh

# 查看最终生效的配置
docker compose config
~~~

修改了 Dockerfile 或构建配置后，常用流程是：

~~~shell
docker compose build
docker compose up -d
~~~

Compose 的命令要在包含 compose.yaml 或 docker-compose.yml 的目录中执行，也可以用 -f 文件名指定配置文件。

## 十一、最常用的一套流程

~~~shell
# 1. 下载镜像
docker pull nginx:alpine

# 2. 启动容器
docker run -d --name web -p 8080:80 nginx:alpine

# 3. 查看状态和日志
docker ps
docker logs -f web

# 4. 进入容器排查问题
docker exec -it web sh

# 5. 停止并删除容器
docker stop web
docker rm web

# 6. 确认不用后删除镜像
docker rmi nginx:alpine
~~~

记住 Docker 的核心思路：

~~~text
镜像 → 创建容器 → 启动容器 → 查看日志/进入排查 → 停止 → 删除
~~~

最值得先记住的命令是：

~~~shell
docker ps -a                 # 查看所有容器
docker images                # 查看镜像
docker run                   # 创建并启动容器
docker logs -f 容器名          # 查看日志
docker exec -it 容器名 sh       # 进入容器
docker stop 容器名             # 停止容器
docker rm 容器名               # 删除容器
docker compose up -d          # 启动一组服务
docker compose down           # 停止一组服务
~~~
