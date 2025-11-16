注册码：
- **产品代号（Product Code）**: 4vkjwhfeh3ufnqnmpr9brvcuyujrx3n3le
- **序列号（Serial Number）**: 226959
- **密码（Password）**: xs374ca

![](upload/Pasted%20image%2020251116234514.png)

## PLSQL首选项配置

登陆时可以点击取消进入主页。
- Oracle Home：在配置中点击首选项配置，PLSQL会自动检测Oracle home目录。也可以自己指定。
- OCI库：OCI库也是自动选择。必须配置否则无法链接。
- 环境变量：
	- NLS_LANG：SIMPLIFIED CHINESE_CHINA.ZHS16GBK
	- NLS_DATE_FORMAT：DD-MM-YYYY
	- TNS_ADMIN：对应着存放TNS连接文件`%Oracle_home%product\11.2.0\dbhome_1\NETWORK\ADMIN`

环境变量也对应着Windows系统的环境变量。

![](upload/Pasted%20image%2020251116234900.png)

TNS_ADMIN路径下的文件：

![](upload/Pasted%20image%2020251116235818.png)

