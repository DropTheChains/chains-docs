
# Debian13虚拟机 用Windows11宿主机代理拉取Docker镜像

> 重点：`docker pull`是**dockerd守护进程**执行，**不是shell环境变量**，只设置`export http_proxy`是无效的。 环境：VMware/VirtualBox 虚拟机，网络模式推荐 **NAT模式**。

## 第一步：Windows11宿主机配置（必须做！）

1. **代理软件开启【允许局域网连接 / Allow‑LAN】** Clash/Mihomo/V2rayN等，默认只监听`127.0.0.1`，虚拟机连不上，**一定要打开允许局域网访问**。 记录你的代理**HTTP端口**（常见7890 / 7897 /10809）

![](upload/Pasted%20image%2020260823164030.png)

    
    > 优先用HTTP代理端口，不要直接用socks5端口给docker daemon。
    
2. 获取Windows本机局域网IP Win11打开PowerShell：

```
ipconfig
```

找到你网卡（WiFi/以太网）IPv4地址，例如`192.168.1.5`。

> ❗不要写127.0.0.1，这个是虚拟机自己，不是Windows主机。

3. Windows防火墙放行代理端口（非常关键） Win+R输入`wf.msc` → 入站规则 → 新建规则

- 规则类型：端口 → TCP → 填入你的代理端口（如7890）
- 操作：允许连接
- 配置文件：**专用+公用全部勾选**
- 名称：`VM Proxy Port 7890`



![](upload/Pasted%20image%2020260823164228.png)

## 第二步：Debian13 配置Docker Daemon代理（用于docker pull拉镜像）

> docker pull 由dockerd服务执行，需要修改systemd配置文件，**不是/etc/docker/daemon.json**！daemon.json不支持dockerd代理设置。

1. 创建systemd配置目录

```
sudo mkdir -p /etc/systemd/system/docker.service.d
```

2. 创建代理配置文件

```
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf <<EOF
[Service]
#替换为你的Windows主机IP和代理HTTP端口
Environment="HTTP_PROXY=http://192.168.1.5:7897"
Environment="HTTPS_PROXY=http://192.168.1.5:7897"
#不走代理的地址：本机、docker内部网段
Environment="NO_PROXY=localhost,127.0.0.1,172.16.0.0/12"
EOF
```

> 注意：即使是https网站，代理地址协议依然写`http://`，不要写成https://。

3. 重载systemd，重启docker服务

```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

4. 验证dockerd代理是否生效

```
systemctl show --property=Environment docker
```

输出能看见`HTTP_PROXY/HTTPS_PROXY`环境变量，代表配置成功。

5. 测试拉取镜像

```
sudo docker pull hello-world
```


![](upload/Pasted%20image%2020260823164526.png)

## 补充配置（两个可选）

### 1. 虚拟机shell命令行代理（curl/apt等工具走代理）

编辑`/etc/profile`全局生效所有用户

```
sudo tee -a /etc/profile <<EOF
export HTTP_PROXY="http://192.168.1.105:7890"
export HTTPS_PROXY="http://192.168.1.105:7890"
export NO_PROXY="localhost,127.0.0.1,172.16.0.0/12"
EOF
source /etc/profile
```

### 2.容器内部代理（docker run / docker build构建时容器内网络）

编辑`~/.docker/config.json`，这个作用于容器内部网络，**不影响docker pull**

```
mkdir -p ~/.docker
tee ~/.docker/config.json <<EOF
{
  "proxies": {
    "default": {
      "httpProxy": "http://192.168.1.105:7890",
      "httpsProxy": "http://192.168.1.105:7890",
      "noProxy": "localhost,127.0.0.1,172.16.0.0/12"
    }
  }
}
EOF
```

## 常见排错清单（90%问题在这里）

1. **连接超时 connection refused**
    - Windows代理软件没有打开`允许局域网连接`
    - Windows防火墙没有放行代理端口TCP
    - IP填错，填成虚拟机自己127.0.0.1
    - 使用了Socks5端口给daemon（dockerd优先http代理端口）
2. **设置完环境变量export，docker pull依然不走代理**
    
    > 记住：`export http_proxy`只是当前shell的环境变量，**dockerd服务是systemd启动的独立进程，完全不继承shell环境变量，必须改`/etc/systemd/system/docker.service.d/http-proxy.conf`**，这是最容易踩的坑。
    
3. 想关闭代理

```
sudo rm /etc/systemd/system/docker.service.d/http-proxy.conf
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 重要区分

|配置位置|作用对象|
|---|---|
|`/etc/systemd/system/docker.service.d/http-proxy.conf`|dockerd守护进程：**docker pull、docker push**（拉镜像，这是你需要的）|
|shell export /etc/profile|curl、apt、wget等主机命令，**不影响docker pull**|
|`~/.docker/config.json`|容器内部网络（docker run/docker build里面RUN命令访问外网），**不影响docker pull**|

> 国内镜像源基本失效，dockerd直接配置宿主机代理是目前最稳定的拉取dockerhub镜像的方案。

