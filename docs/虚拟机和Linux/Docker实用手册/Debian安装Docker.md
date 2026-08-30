
# Debian13(Trixie) 安装Docker完整步骤

> 不要用apt直接装`docker.io`，那是Debian源的旧版本，使用Docker官方apt源安装。 如果你是root账号，可以把命令前面`sudo`去掉。

## 步骤1：卸载旧版本（如有）

```
sudo apt remove -y docker docker-engine docker.io containerd runc
```

## 步骤2：更新系统并安装依赖

```
sudo apt update
sudo apt install -y ca-certificates curl
```

## 步骤3：导入Docker官方GPG密钥

```
# 创建密钥目录
sudo install -m 0755 -d /etc/apt/keyrings
#下载密钥
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

## 步骤4：添加Docker软件源

```
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

## 步骤5：安装Docker全套组件

```
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

> 包含：docker引擎、cli、containerd、buildx、新版docker compose插件（命令`docker compose`，不带横杠）

## 步骤6：启动并设置开机自启

```
#启动+开机自启
sudo systemctl enable --now docker

#查看运行状态
sudo systemctl status docker
```

## 步骤7：验证安装

```
sudo docker run hello-world
```

输出hello-world说明安装成功。

## 可选配置

### 1.免sudo执行docker命令（当前用户不用每次敲sudo）

```
sudo groupadd docker
sudo usermod -aG docker $USER
```

> ⚠️执行完**必须退出当前ssh会话重新登录**，权限才生效。

### 2.配置国内镜像加速（解决拉取镜像慢）

编辑`/etc/docker/daemon.json`

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF
#重启docker生效
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 常用命令速查

```
#查看docker版本
docker --version
#查看compose版本
docker compose version
#查看docker信息
docker info
```

## 快速脚本一键安装（测试环境）

> 适合快速部署，生产建议上面分步操作

```
curl -fsSL https://get.docker.com | sudo sh
```

### 常见问题

1. `permission denied`：没有加sudo，或者用户加入docker组后没重登ssh
2. 源下载慢：配置国内镜像加速
3. 服务启动失败：检查`/etc/docker/daemon.json`格式是否合法，逗号不能多写。

