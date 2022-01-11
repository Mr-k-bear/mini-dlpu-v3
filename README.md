# 第三代掌上教务处小程序

掌上教务处作为工业大学的社区开源项目，自从2017年开始已有近5年岁月，在无数同学的贡献之下，为大家打造便捷的校园服务。

__*!!!警告!!!*__

请在主仓库提交代码，而非镜像仓库！在镜像仓库提交的代码将会在同步时被覆盖！

主仓库： http://git.mrkbear.com/MrKBear/mini-dlpu-v3

镜像仓库： https://github.com/Mr-k-bear/mini-dlpu-v3

## 目录

- [社区介绍](#小程序社区)
- [项目设计](#第三代小程序)
- [贡献规范](#社区贡献规范)
- [API文档](https://docs.apipost.cn/preview/e737de418d4ef150/419d45d8c97d6a9f)
- [入门文档(等待撰写)](#第三代掌上教务处小程序)
- [设计架构(等待撰写)](#第三代掌上教务处小程序)

## 小程序社区

掌上教务处小程序诞生于2017年中旬，此时微信小程序刚刚公测。

2017年，信息学院吴学长因兴趣设计了一款方便课表查询的小工具，在班级范围内使用，就这样掌上教务处诞生了。

随着大家的好评和认可，小程序使用范围慢慢扩大，从班级到专业到学院，同时，吴学长也面临着越来越大的责任和压力。

正当小程序维护困难之际，很多热心的同学，为吴学长贡献代码，创意，UI设计图纸，从此"成绩查询"、"考试日程"、"空教室"这样的小功能如雨后春笋，慢慢诞生......

此时，作为大家努力的结晶，小程序开放了源代码。

> PS:
> 哈哈，你可能会好奇为什么小程序的LOGO看起来很奇怪，其实这个 LOGO 是一个热心的同学在2018年贡献的，为了纪念小程序最初的贡献者们一直沿用至今。

毕竟服务器是有成本的，随着用户的增多，吴学长自掏腰包租赁的服务器，已不再能维持小程序流畅运行，小程序再次陷入困境。

这时有其他热心同学，赞助了自己租赁的服务器...
越来越多，越来越多，不愿透露名字的热心人给服务器取了有趣的名字。

就这样，"笔芯"、"妲己"、"猪蹄"、"MOS"...一台台自租赁的服务器支撑起了大家的日常使用。

> PS:
> 如果你愿意考古的话，去看看老版本小程序的切换服务器页面，它们就这样静静的挺拨在那里，为大家默默的服务着...

后来随着开发者们的加入，小程序有了更多的功能、更好的技术、更高的性能。

2019年期间，在吴学长、秦学长、梁学长、潘学姐、隋学长以及其他社区贡献者的共同努力下，第二代小程序诞生了，并更名为"掌上教务处"。

重构后的小程序，犹如脱胎换骨，性能提高很多倍，得到了很多同学的关注，用户数量达到19000人。

2020年随着小程序的稳定，大家也已经习惯了目前的设计，但是小程序仍有部分设计缺陷，导致可拓展性降低，难以拓展新功能，无法和其他商业产品竞争。

老一代社区贡献者们开始逐渐毕业，社区迎来前所未有的空窗期。
社区团队逐渐消退，仅剩梁学长、秦学长在日常爱心维护小程序代码，供大家日常使用。

## 第三代小程序

突破内容：

1. 小程序在技术上突破更高的性能瓶颈

2. 更漂亮的UI，和更好的交互体验

3. 更好的拓展性，加入更多大家喜欢的功能

新功能:

1. 正在讨论设计，等待你的建议...

## 社区贡献规范

请仔细阅读！
### 项目贡献流程

请先邮件联系 ```mrkbear@mrkbear.com``` 获得 Gitea 平台账号

在仓库中创建自己的分支，分支命名规范为 ```dev-你的昵称```，例如 ```dev-mrkbear```

克隆此储库，在本地 ```git checkout dev-你的昵称``` 到自己的分支，进行改动。

开发完成后 ```git push``` 到自己的远程分支，并发起合并请求到 ```master``` 分支

发起合并请求时，需要指派给 ```MrKBear``` 进行代码审核，审核通过后，代码将完成合并。

### 注意事项

1. ```master``` 分支处于保护状态，仅通过合并请求进行修改

2. 代码提交时，请使用清晰明确的 ```message```

正例: ```Add timetable page``` 反例: ```阿巴阿巴阿巴阿巴```

3. 请勿将任何个人隐私信息以任何方式，放入代码中

4. 为保证 CI/CD，提交代码前必须保证编译可以通过

5. 一个文件不要超过 1000 行代码，尽量保证代码可读性

## 贡献者

@MrKBear (熊鲜森)