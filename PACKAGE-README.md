# 北大医疗手机版 H5 代码包

## 入口
- 首页：`mobile.html`
- 医疗团队：`team.html`
- 科室列表：`team.html?view=departments`
- 成员介绍：`member.html?id=成员ID`
- 科室介绍：`department.html?id=科室ID`
- 品牌展示：`brand.html`

## 运行方式
这是纯静态站点，无需构建。

在当前目录启动一个静态服务器：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080/mobile.html
```

不要直接双击 `mobile.html`，部分浏览器在 `file://` 下会限制页面参数和本地资源加载。

## 目录说明
- `mobile.html/css/js`：手机版首页、医院介绍、组织架构、搜索和机构列表
- `team.html/css/js`：医疗团队、分类筛选、科室列表
- `member.html/css/js` + `member-details.js`：成员介绍详情
- `department.html/css/js` + `departments-data.js`：科室介绍、科室特色、学科带头人、医生团队
- `brand.html/css/js`：品牌展示 H5
- `medical-team-data.js`：726 位医师及 57 位专家数据
- `operations-team-data.js`：运营督导、运营管家、健管师、营养师、康复师五类运营成员数据
- `assets/`：Logo、医院图片、国际护理图片、667 位成员照片
- `previews/`：主要页面截图
- `README.md`：项目完整说明
