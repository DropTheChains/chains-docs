
# Docker 拉取并运行 MySQL8 完整命令

## 1.拉取镜像

```
#拉取mysql8最新版本
docker pull mysql:8
```

## 2.运行容器（生产常用参数版本）

```
docker run -d \
  --name mysql8 \
  --restart always \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD="chains6344" \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_USER=chains \
  -e MYSQL_PASSWORD="chains6344" \
  -v /data/mysql8/data:/var/lib/mysql \
  -v /data/mysql8/conf:/etc/mysql/conf.d \
  -v /data/mysql8/log:/var/log/mysql \
  mysql:8 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci
```

### 参数解释

| 参数                                       | 说明                         |
| ---------------------------------------- | -------------------------- |
| `-d`                                     | 后台守护模式运行容器                 |
| `--name mysql8`                          | 容器名称为mysql8                |
| `--restart always`                       | 开机/ Docker重启自动启动容器         |
| `-p 3306:3306`                           | 端口映射，宿主机3306映射容器3306       |
| `MYSQL_ROOT_PASSWORD`                    | root账号密码，**必须设置**          |
| `MYSQL_DATABASE=mydb`                    | 容器启动自动创建mydb数据库            |
| `MYSQL_USER/MYSQL_PASSWORD`              | 新建普通用户和密码，自动授权上面的库         |
| `-v /data/mysql8/data:/var/lib/mysql`    | 数据持久化，数据库文件挂载宿主机，容器删除数据不丢失 |
| `-v /data/mysql8/conf:/etc/mysql/conf.d` | 自定义配置文件挂载，放my.cnf          |
| `-v /data/mysql8/log:/var/log/mysql`     | 日志挂载                       |
| `mysql:8`                                | 镜像名称标签                     |
| `--character-set-server=utf8mb4`         | 数据库默认字符集，支持emoji表情         |
| `--collation-server=utf8mb4_unicode_ci`  | 排序规则                       |

> ⚠️注意：宿主机目录`/data/mysql8/*`如不存在，docker会自动创建； 密码复杂度按自己业务修改，不要直接用示例密码上线。

## 3.查看容器状态

```
docker ps
```

## 4.进入容器mysql客户端连接

```
docker exec -it mysql8 mysql -uroot -p
#输入设置的root密码 Root@123456
```

## 5.外部客户端连接信息

- host：宿主机IP
- port：3306
- user：root / myuser
- password：对应设置密码

## 6.简单排错

1. 挂载目录权限异常，mysql启动失败：

```
chmod -R 777 /data/mysql8
```

2.查看日志：

```
docker logs mysql8
```

## 极简测试版本（不持久化，仅本地测试用）

```
docker run -d --name mysql8-test -p3307:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8
```

> 该版本没有挂载卷，容器删除数据全部丢失，只适合开发测试。

## 补充：自定义my.cnf示例（放到/data/mysql8/conf/my.cnf）

```
[mysqld]
max_connections=2000
default-time_zone = '+8:00'
```

修改配置后重启容器生效：`docker restart mysql8`

