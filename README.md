# pyecharts-assets

pyecharts-assets 提供了 [pyecharts](https://github.com/pyecharts/pyecharts) 的静态资源文件。

可通过 localhost-server 或者 notebook-server 启动本地服务

**localhost-server**

启动服务器
```shell
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

**notebook-server**

安装扩展插件
```shell
$ jupyter nbextension install assets
$ jupyter nbextension enable assets/main
```

设置 host
```python
 # 只需要在顶部声明 CurrentConfig.ONLINE_HOST 即可
from pyecharts.globals import CurrentConfig, OnlineHostType

CurrentConfig.ONLINE_HOST = OnlineHostType.NOTEBOOK_HOST

# 接下来所有图形的静态资源文件都会来自刚启动的服务器
from pyecharts.charts import Bar
bar = Bar()
```
