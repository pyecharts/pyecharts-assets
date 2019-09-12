# pyecharts-assets

pyecharts-assets 提供了 [pyecharts](https://github.com/pyecharts/pyecharts) 的静态资源文件。

可通过 localhost-server 或者 notebook-server 启动本地服务。首先将项目下载到本地

```shell
# 通过 git clone
$ git clone https://github.com/pyecharts/pyecharts-assets.git

# 或者直接下载压缩包
$ wget https://github.com/pyecharts/pyecharts-assets/archive/master.zip
```

**Localhost-Server**

启动服务器
```shell
$ cd pyecharts-assets
$ python -m http.server
```

设置 host
```python
# 只需要在顶部声明 CurrentConfig.ONLINE_HOST 即可
from pyecharts.globals import CurrentConfig

CurrentConfig.ONLINE_HOST = "http://127.0.0.1:8000/assets/"

# 接下来所有图形的静态资源文件都会来自刚启动的服务器
from pyecharts.charts import Bar
bar = Bar()
```

**Notebook-Server**

安装扩展插件
```shell
$ cd pyecharts-assets
# 安装并激活插件
$ jupyter nbextension install assets
$ jupyter nbextension enable assets/main
```

设置 host
```python
 # 只需要在顶部声明 CurrentConfig.ONLINE_HOST 即可
from pyecharts.globals import CurrentConfig, OnlineHostType

# OnlineHostType.NOTEBOOK_HOST 默认值为 http://localhost:8888/nbextensions/assets/
CurrentConfig.ONLINE_HOST = OnlineHostType.NOTEBOOK_HOST

# 接下来所有图形的静态资源文件都会来自刚启动的服务器
from pyecharts.charts import Bar
bar = Bar()
```
