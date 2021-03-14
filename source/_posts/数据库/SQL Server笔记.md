---
title: SQL Server学习笔记
author: 靓仔
date: 2019-08-26 10:27:49
tags: [SQL Server]
categories: 数据库
---





#### 基本术语



1. `数据 （Data）`：数据库存储的基本对象，例如文字、图形、图像等，计算机用来描述事物特征的统称为数据。
2. `数据库（Data Base）`：数据存放的仓库。
3. `数据库管理系统（DBMS）`：管理数据库的软件/平台。
4. `数据库系统（DMS）`：相当于一个完整的数据库生态圈，它由DB、DBMS、DBA、用户等构成。其中DBMS是数据库系统的核心软件。
5. `数据库管理员（DBA）`：管理数据库的人员。





---





#### 数据库发展阶段



1. 人工管理阶段
2. 文件系统阶段
3. **数据库管理阶段**
   - 该阶段的特定：
     1. 数据结构化（与文件系统的本质区别）。
     2. 数据共享性高。
     3. 低冗余、易扩展。
     4. 数据独立性高。
     5. 由DBMS统一管理和控制。





---





#### 数据模型



> 数据模型由 数据结构、数据操作、数据完整性约束组成



- 常用的数据模型
  1. 层次模型
  2. 网状模型
  3. 关系模型



- 关系模型的特点
  1. 描述的一致性
  2. 利用公共属性连接
  3. 结构简单直观
  4. 语言表达简练



---





#### 三级模式（考）





三级模式为：

- 外模式（用户级）：也叫子模式，描述用户看到或使用的数据的局部逻辑结构和特征
- 模式（概念级）：数据库全体数据逻辑结构和特征的描述
- 内模式（物理级）：也叫存储模式，是整个数据库最底层的表示



注意点：

> 外模式可以有多个，但模式与内模式只能有 一个





---





#### 二级独立性



1. 物理独立性：物理层发生改变，逻辑层可以保持不变

> 应用程序与磁盘上数据库的数据互相独立



2. 逻辑独立性：逻辑层发生改变，应用层可以保持不变

> 应用程序与数据库的逻辑结构互相独立





---





#### 二级映像



1. 外模式/外模式映像

> 保证了数据与程序的逻辑独立性



2. 内模式/内模式映像

> 保证了数据与程序的物理独立性





---







#### 创建数据库

```mysql
create database 数据库名

// 新建数据库文件
on primary (
	name=数据库文件名,	
    filename = '存放路径.mdf',
    size = 10mb,
    maxsize = 100mb,
    filegrowth = 10mb
)

// 新建数据库日志文件
log on (
	name=日志文件名,
    filename='存放路径.ldf',
    size = 10mb,
    maxsize = 100mb,
    filegrowth = 10mb
)
```

创建数据库的参数如下：

1. `name` ： 数据库文件/日志文件名
2. `filename` ：存放的路径（包含文件名）
3. `size` ：初始大小
4. `maxsize` ：最大容量
5. `filegrowth` ：每次增加多少

> 存放的路径必须先存在，才能创建，SQL Server 不会自动创建文件夹，所以我们写路径的时候，必须保证路径上的目录是以存在的



**注意点：**

1. 存放路径要用引号包起来
2. 括号里的最后一个字段不要加逗号



---



#### 查看数据库信息

- 格式：`exec sp_helpdb 查看的数据库对象`



下面的例子，查看 test 数据库的相关信息

```mysql
exec sp_helpdb test
```





#### 修改数据库信息

- 格式：`alter database 数据库对象` `modify name/file`



下面的例子，将test数据库更名为base，并修改数据库文件大小等相关属性：

```mysql
/* 改名 */
alter database test
modify name = base

/* 改数据库文件属性 */
alter database base
modify file(
	/* 这里要注意，name指的是源文件名，是指定了要找哪个文件修改下方的属性 */
    name = test,
    size = 10mb,
    maxsize = 50mb,
    filegrowth = 1mb
)
```



**注意点：**

1. 修改数据库属性时，不能更改路径
2. 注意 modify file 里的name是干嘛的



---





#### 删除数据库

格式：`drop database 要删除的数据库名`



下面的例子，删除名为 test 的数据库：

```mysql
drop database test
```



**注意点：**

1. 不能删除系统数据库
2. 删库不细看，亲人两行泪



---





#### 备份与还原



- 备份：鼠标选中要备份的数据库，右键选择 “`任务`” 选项，选择 “`备份`”，选择 “`完整备份`” 或者 “`差异备份`”，选择要备份到的路径，点击确定。备份文件的后缀为  **`.bak`**
- 还原：点击 `数据库` 选项，鼠标右键选择 “`还原数据库`”，选择备份文件的路径，点击确定

> 其实，直接复制源文件也算是备份，只不过 .bak 备份文件的体积比较小，而你手动复制的话体积比较大。



---





#### 分离与附加



- 分离：鼠标选中要备份的数据库，右键选择 “`任务`” 选项，选择 “`分离`”，点击确定。
- 附加：点击 `数据库` 选项，鼠标右键选择 “`附加`”，选择数据库文件的路径，点击确定。



> 分离仅仅是将该数据库从列表中移除，并不会删除它。
>
> 如果某个数据库仍存在列表中，那么你无法删除它，除非你将它分离或脱机。



---





#### 创建表

格式：`create table 表的名称`



下面的例子，创建一个学生表，设置id、姓名、性别、年龄，4个字段，并设置相应的格式要求：

```mysql
/* 创建 表  表名称 */
create table student(
	/* id，整形，设置为主键，不能为空 */
	id int primary key not null,
	/* name，可变长度字符型，最多10个字节，不能为空 */
	name varchar(10) not null,
	/* age，整形，可为空 */
	age int null,
	/* sex，字符型，固定长度2字节，可为空 */
	sex char(2) null
)
```



---





#### 修改表中的字段类型



```mysql
/* 修改 表 学生表 */
alter table student
/* 修改 字段 name 类型改为 varchar(100) 可以为空 */
alter column name varchar(100) not null
```





---





#### 创建视图



格式如下：

```mysql
create view 视图名
as
	select xxx,xxx,xxx
	from xtable
	where ···
```





---





#### 删除视图



**格式：**`drop` `view` `视图名`





---





> 更新视图与查询视图的操作， 与操作普通一模一样，这里不再演示





---





#### 添加主键



```mysql
/* 修改 表 学生表 */
alter table student
/* 添加 约束 主键名 name做为主键 */
add constraint kid primary key(name)
```



---



#### 修改表中的字段名



```mysql
/* 执行 修改名称 学生表里的 name 重命名为 studentname*/
exec sp_rename 'student.name','studentname'
```



---





#### 添加字段



```mysql
/* 修改 表 学生表 */
alter table student
/* 添加 likes 这个字段 该字段的类型为 varchar(100)，可为空 */
add likes varchar(100) null
```



---



#### 删除表



```mysql
/* 删除 表 student */
drop table student
```



---





#### 设置外键



**格式如下:**

```mysql
alter table 给哪个表加外键
add constraint 外键名
foreign key(哪个字段做外键)
references 主表(主键)
```



下面的例子, 给class表添加一个外键, 该外键为student表的sno :

```mysql
/* 修改 表 class */
alter table class
/* 添加 约束 名为fk */
add constraint fk
/* 外键 设置在 sno */
foreign key(sno)
/* 依赖于 student表的sno字段 */
references student(sno)
```



> 这样一来, 如果主表里没有sno这个字段, 那么 class 里将无法使用 sno, 这样就达到了我们限制的目的; 毕竟没有学号的学生, 是没有专业没有课程的.



---





#### 添加记录



**格式如下:**

```mysql
insert into 添加到哪个表
("字段1","字段2","字段3")

values
("数据1","数据2","数据3")
```





- **下面的例子, 给student表添加一条学生信息, 学生名为赵六 :** 

```mysql
insert into student
("sno","name","sex")
values
("2017130301","赵六","男")
```





- **若一次要插入多个条记录, 则格式如下 :** 

```mysql
insert into 添加到哪个表
("字段1","字段2","字段3")

values
("数据1","数据2","数据3"), /* 第一条 */
("数据1","数据2","数据3"), /* 第二条 */
("数据1","数据2","数据3"), /* 第三条 */
("数据1","数据2","数据3"), /* 第四条 */
("数据1","数据2","数据3"); /* 第五条 */
```





- **若要从其他表复制数据过来插入, 则需结合查询语句, 格式如下 :** 

```mysql
insert into 添加到哪个表
("字段1","字段2","字段3")

select "字段1","字段2","字段3"
from 其他表
```





**注意点:**

1. 字段的括号里要用双引号, 不能用单引号
2. 注意 `values` , 注意末尾的 `s`
3. 字段和值的数量要一一对应, 不能多, 也不能少
4. 数据的类型与字段规定的类型要匹配



---





#### 查询数据



格式如下:

1. 普通查询 :  `select`  要查询的字段  `from`  从哪个表里查
2. 查询全部 :  `select`  *  `from`  从哪个表里查
3. 去除重复项的查询 :  `select`  `distinct`  要查询的字段  `from`  从哪个表里查
4. 查询前多少行数据 :  `select` `top`  行数  要查询的字段  `from`  从哪个表里查



---





#### 修改数据



**格式如下 :** 

```mysql
update 要修改哪张表的数据
set 要修改的字段 = 值
where 修改的条件
```





下面的例子,  将student表里, 学号为2017130305的学生, 将他的名字改为张三 :

```mysql
/* 更新 student 里的数据 */
update student
/* 设置 name 为 张三*/
set name = '张三'
/* 只有 sno 为2017130305时, 才更改 */
where sno = 2017130305
```



**注意点 :**

1. 更新数据时, 最好要写上条件, 如果不写条件, 则会默认将字段对应的所有数据都进行更改, 那样可能会造成很严重的后果.



---



#### 删除数据



格式如下 :

```mysql
delete from 要删除哪张表的数据
where 删除的条件
```





下面的例子,  从student表里,  删除名字叫张三的学生数据 : 

```mysql
/* 删除 student 里的数据 */
delete  from  student
/* 名字为张三的, 都删除 */
where name = '张三'
```



**注意点 :**

1. 删除数据时, 最好要写上条件, 如果不写条件, 则会默认删除整张表的全部数据, 那样可能会造成很严重的后果.



---





#### 条件限制



##### 1. 精确限制

**格式 :**  `where  字段 = 值`



下面的例子,  查询student里的数据, 并且只查询性别为 "男" 的数据 :

```mysql
/* 查询 所有 从 student里 */
select * from student
/* 只查询 sex = 男 , sex ≠ 男 则不查 */
where sex = '男'
```



> 这里我仅仅是将条件限制用在了查询上, 你们同样可以用在其他例如 删除, 更新等等, 这里我就不演示了, 大家要活学活用啊.



---



##### 2. 模糊限制

**格式1 :**  `where  字段  like  '%值%'`

- % 表示省略掉的字, %在前面就表示省略前面的, %在后面就代表省略后面的; %代表0个或多个

**格式2 :**  `where  字段  like  '_值'`

- _ 是下划线, 表示任意一个, 单个

**格式3 :**  `where  字段  like  '[n-n]'`

- [] 中括号, 表示一个范围 



> 上面三种格式可以自由灵活的搭配使用



- 下面的例子, 使用模糊查询, 查询student表里, 所有姓名以  "月"  字结尾的学生数据 : 

```mysql
select * from student
where name like '%月'
```



- 下面的例子, 使用模糊查询, 查询student表里, 所有姓名以  "林" 字开头的学生数据 : 

```mysql
select * from student
where name like '林%'
```



- 下面的例子, 使用模糊查询, 查询student表里, 所有姓名中带有  "龙"  字的学生数据 : 

```mysql
select * from student
where name like '%龙%'
```



> 通过上面的例子, 我们可以得出使用的结论 :
>
> 1. 以什么开头, 就把什么放在前面, %放后面
> 2. 以什么结尾, 就把什么放在后面, %放前面
> 3. 如果是处在中间的数据, 则 数据两边都放 %



**注意点 :**

1. 一定要注意  %  放的位置.





- 下面的例子, 查找姓名中 A 到 C 中的任意一个字符 :

```mysql
select * from student
where name like '[A-C]'
```



- 下面的例子, 查找姓名中 A 或 B 或 C  :

```mysql
select * from student
where name like '[A,B,C]'
```



- 下面的例子, 查找姓名中**不是** A 也不是 B 也不是 C  的任意一个字符:

```mysql
select * from student
where name like '[^A-C]'
```



---





##### 3. 范围限制

**格式 :**  `where`  字段  `between`  起始值  `and`  结束值



- 下面的例子,  查询student里, 学号从2017130301 到 2017130305 之间的所有学生数据 :

```mysql
select * from student
where sno between 2017130301 and 2017130305
```



- 下面的例子, 查询student里, 生日从 1999-09-09 到 2002-02-02 之间的所有学生数据 :

```mysql
select * from student
where birthday between '1999-09-09' and '2002-02-02'
```



- 下面的例子, 查询student里, 所有年龄**不在18 到 20 之间**的学生信息 :

```mysql
select * from student
where age not between 18 and 20
```



- 下面的例子, 查询student里, 入学时间2017-09-09到现在的所有学生信息 :

```mysql
select * from student
where EnrollmentTime between '2017-09-09' and getdate();
```



---





#### 子查询  in



**格式 1:** `where`  字段  `in`  (  `select` 字段 `from`  另一个表 )

**格式 2:** `where`  字段  `not`  `in`  (  `select` 字段 `from`  另一个表 )



> 主查询就是最外面那个select,  子查询就是 in 后面括号里的 select ; 
>
> 子查询起到的是查询的作用, 而主查询起到的是限制的作用;
>
> 主查询根据子查询返回的结果, 然后使用该结果来作为查询的限制条件





- 下面的例子, 查询student里, 年龄为 19, 21, 23岁的所有学生信息 :

```mysql
select * from student
where age in (19, 21, 23)
```

> 上面这个例子, 可以把括号里的理解为 "或"
>
> 查询所有年龄等于19 或 21 或 23



- 下面的例子,  student表里有很多个学生, 请查询所有选了课的学生数据, 选课信息在class 表内:

```mysql
select * from student
/* 2. 根据子查询返回的结果做出查询限制, 凡是在class里存在的学号,那么就把主表里对应的学生信息输出 */
where sno in (
    /* 1. 这里返回的是选课表里, 已经选了课的学号 */
	select sno from class
)
```



---





#### 子查询  exists



**格式1 :** `where`  `exists`  (  `select` * `from`  另一个表 )

**格式2 :** `where`  `not`  `exists`  (  `select` * `from`  另一个表 )



> exists  和  in  的区别并不是很大,  甚至很相似, 区别是 exists  子查询返回的是 true  或  false.
>
> 如果主查询的内容存在于子查询中,  则  exists  会返回  true  ,  返回  true的话,  则将输出 主查询要查询的内容.
>
> 如果返回的是  false ,  则不作任何操作



- 下面的例子, 使用 `exists` 来进行选课学生信息的查询,  例子与 in 的相同 : 

```mysql
select s.sno from student as s
/* 3. 如果返回的是 true, 则将 student.sno输出 */
where exists (
    /* 1. 查询class表的所有数据 */
	select * from class as c
    /* 2. 如果 student的学号与 class的学号相同, 则返回true */
	where s.sno = c.sno
)
```



> 取反的话, 则在 exists 前加  not 即可,  这里不再演示





---





#### 排序



**格式 :**  `order  by`  通过哪个字段来排序  `asc` / `desc`

- `asc`  从小到大,  也就是升序,  默认值.
- `desc`  从大到小,  也就是降序.



**如果对多个字段进行规则排序的话, 则按照下面的写法 :**

- **格式 :**  `order  by`  字段1 ,  字段2  `desc`  ,  字段3  `desc`  





- 下面的例子, 查询student里所有的学生信息, 并根据学号进行升序排序 : 

```mysql
select * from student
/* 默认就是 asc, 可以不用写 */
order by sno
```



- 下面的例子, 查询student里所有的学生信息, 并根据学号进行降序排序 : 

```mysql
select * from student
/* desc 降序 */
order by sno desc
```





---





#### 关联查询 ( 多表查询 ) 



##### 1. 交叉关联

格式如下 :

```mysql
select * from 表1
	inner join 表2
	on 表1.xxx = 表2.xxx
```



> 交叉关联的特性, 会将表1与表2相匹配的字段进行返回, 注意, 两个表匹配的字段是被合并为一个表进行返回.



##### 2. 左关联

格式如下 :

```mysql
select * from 表1
	left join 表2
	on 表1.xxx = 表2.xxx
```



> 左关联的特性, 会将表1的全部数据与表2相符合的数据进行返回
>
> 注意 :
>
> 左边表1返回全部数据
>
> 右边表2会返回匹配到的数据, 匹配不到的将返回null

##### 3. 右关联

格式如下 :

```mysql
select * from 表1
	right join 表2
	on 表1.xxx = 表2.xxx
```



>左关联的特性, 会将表1的全部数据与表2相符合的数据进行返回
>
>注意 :
>
>左边表1返回匹配到的数据, 匹配不到的将返回null
>
>右边表2返回的是全部数据
>
>也就是右关联与左关联刚好相反



下面的例子, 查询所有选了课的同学个人信息与课程信息 , 请使用 交叉关联 的方式进行查询:

```mysql
select * from student
inner join class
on
student.sno = class.sno
```



---





#### 聚合函数

> 聚合函数, 就是对某些函数当中的一些值或字段进行计算的, 计算什么? 计算和, 计算差, 计算平均值等



##### 1. avg()

**格式 :** `avg( 字段 )`

**作用 :**  求平均值



> 注意 : 该函数接收的字段必须是数值类型!!!



下面的例子,  求student表里所有学生的平均成绩 :

```mysql
select avg(score) 平均成绩 from student
```



---





##### 2. sum( 字段 )

**格式 :** `sum( 字段 )`

**作用 :**  求和



下面的例子, 求student里所有学生成绩之和 :

```mysql
select sum(score) 总成绩合计 from student
```



---





##### 3. max( 字段 )

**格式 :** `sum( 字段 )`

**作用 :**  比较多个字段的值, 并返回其中最大的值 ; 可对数字与字符型进行比较



下面的例子, 查询student表中年龄最大的学生 :

```mysql
select max(age) 最大年龄 from student
```



---





##### 4. min( 字段 )

**格式 :** `sum( 字段 )`

**作用 :**  比较多个字段的值, 并返回其中最小的值 ; 可对数字与字符型进行比较



下面的例子, 查询student表中年龄最小的学生 :

```mysql
select min(age) 最小年龄 from student
```



---





##### 5. count( 字段 )

**格式1 :** `count( 字段 )`

**格式2 :** `count_big( 字段 )`

**作用 :**  统计该字段出现的次数, 也就是该字段的数量, 返回值是数值



> count  与  count_big  的使用方法一模一样, 在写法格式上它两没有任何区别.
>
> 它们唯一的区别在于 count_big  可以对大于 2^23 - 1 的数进行统计, 而  count  无法对大于这个数的字段进行统计.
>
>  如果小于这个数, 那么你用哪个都可以.





下面的例子, 统计student 里, 男生的数量 :

```mysql
select count(sex) 性别
from student
where sex = '女'
```



---





##### 6. len( 字段 )

**格式1 :** `len( 字段 )`

**格式2 :** `datalength( 字段 )`

**作用 :**  计算字段的长度



> len 是计算字段的原始长度
>
> datalength 是计算字段的**字节**长度



下面的例子, 计算 student 里 所有学生的姓名长度与姓名的字节长度 :

```mysql
select 
*,
len(name) 姓名的长度,
datalength(name) 姓名的字节长度 
from student
```



---





#### 随机数



**格式 :** `rand() * N`

**作用 :**  得到一个随机小数



通常我们都不需要小数, 我们需要的是随机整数, 那么我们就得借助取整函数来做了, 下面是两种**取整函数 :** 

1. `floor()  向下取整`
2. `ceiling()  向下取整`



下面的例子, 取到一个 0 ~ 100 的随机整数 : 

```mysql
/* 第一种随机整数写法 */
select floor(rand() * 100)

/* 第二种随机整数写法 */
select ceiling(rand() * 100)
```



---





#### 获取时间



**格式1 :** `getdate()`

**格式2:** `getutcdate()`



>getdate  得到的是系统当前时间
>
>getutcdate  得到的是国际标准时间
>
>两者返回的数据类型都是  datetime
>
>一般我们都是用 getdate()



下面的例子, 得到当前时间与国际时间 :

```mysql
/* 得到本地时间 */
select getdate()

/* 得到国际标准时间 */
select getutcdate()
```



---





#### 处理时间格式



**格式 :** convert( `参数1` , `参数2` , `参数3` )

1. `参数1` 是指定的格式
2. `参数2` 是要处理的时间/日期
3. `参数3` 是格式id

**作用:** 用不同的格式处理时间与日期数据



**格式id如下:**

| 格式ID    | 展示的格式                                    |
|-----------|-----------------------------------------------|
| 100 或 0  | mm : dd : yyyy  hh : miAM ( 或者PM )          |
| 101       | mm/dd/yy                                      |
| 102       | yy.mm.dd                                      |
| 103       | dd/mm/yy                                      |
| 104       | dd.mm.yy                                      |
| 105       | dd-mm-yy                                      |
| 106       | dd  mon yy                                    |
| 107       | Mon dd yy                                     |
| 108       | hh : mm : ss                                  |
| 109 或 9  | mon dd yyyy  hh : mi : ss : mmmAM  ( 或者PM ) |
| 110       | mm-dd-yy                                      |
| 111       | yy/mm/dd                                      |
| 112       | yymmdd                                        |
| 113 或 13 | dd mon yyyy  hh : mm : ss : mmm ( 24小时 )    |
| 114       | hh : mi :ss : mmm ( 24小时 )                  |
| 120 或 20 | yyyy-mm-dd hh : mi :ss ( 24小时 )             |
| 121 或 21 | yyyy-mm-dd hh : mi :ss.mmm ( 24小时 )         |
| 126       | yyyy-mm-ddThh : mm : ss.mmm ( 没有空格 )      |
| 130       | dd mon yyyy  hh : mi :ss : mmmAM              |
| 131       | dd/mm/yy  hh : mi :ss : mmmAM                 |



> 以上格式id， 在不同版本的sql server 中可能会有所区别，甚至有些在高版本中可能无效



下面的例子, 使用任意一种格式id来处理当前时间 , 处理后的时间数据格式为varchar(50):

```mysql
select convert(varchar(50), getdate(), 120)
```



> 如果是自己指定某个日期， 日期 必须用单引号括起来





---





#### 日期计算



**格式 1:** datediff( `参数1` , `参数2` , `参数3` )

1. `参数1 -- datepart`  要计算日期中的哪一部分, 可以是年或月或日等
   - **year : 年**
   - **month : 月**
   - **day : 天**
   - **hour : 时**
   - **minute : 分**
   - **second : 秒**
2. `参数2 -- startdate`  开始日期/时间
3. `参数3 -- enddate`  结束日期/时间



**格式 2:** dateadd( `参数1` , `参数2` , `参数3` )

1. `参数1 -- datepart` 要对日期中的哪一部分进行操作, 可以是年或月或日等
2. `参数2 -- number`  正数为添加, 属于未来时间 ; 负数为减少, 属于过去时间
3. `参数3 -- date`  要操作的日期



> 注意 : 以上两种格式里接收的日期, 必须为标准格式的日期, 如果格式不符合标准, 则将无法操作



- 下面的例子, 计算 `2017-05-06 15:00:00`到 `2018-05-06 16:00:00` 相差的年, 月, 日, 时, 分, 秒 :

```mysql
select datediff(year, '2017-05-06 15:00:00','2018-05-06 16:00:00') 相差年

select datediff(month, '2017-05-06 15:00:00','2018-05-06 16:00:00') 相差月

select datediff(day, '2017-05-06 15:00:00','2018-05-06 16:00:00') 相差日

select datediff(hour, '2017-05-06 15:00:00','2018-05-06 16:00:00') 相差时

select datediff(minute, '2017-05-06 15:00:00','2018-05-06 16:00:00') 相差分

select datediff(second, '2017-05-06 15:00:00','2018-05-06 16:00:00') 相差秒
```



- 以当前时间开始, 计算5天后的日期是 :

```mysql
select dateadd(day, 5, getdate())
```



> 如果是自己指定某个日期， 日期 必须用单引号括起来





---





#### 获取日期中的某个部分



**格式如下 :**

1. `datepart ( datepart,  日期 )` 返回的是整数类型
   - datepart =  year / month / day / hour / minute / second / yy / mm / dd
2. `datename ( datepart,  日期 )` 返回的是varchar类型
   - datepart =  year / month / day / hour / minute / second / yy / mm / dd
3. `year( 日期 )` 返回该日期的年份
4. `month( 日期 )` 返回该日期的月份
5. `day( 日期 )` 返回该日期的天



下面的例子, 用以上其中2种方法来获取今天的月份 :

```mysql
/* 方法1 */
select datepart(month, getdate())

/* 方法2 */
select month(getdate())
```



> 如果是自己指定某个日期， 日期 必须用单引号括起来





---





#### 字符串查找



**格式1 :** `charindex( 参数1, 参数2[, 参数3] )`

	1.  **参数1 :**  要查找什么内容
	2.  **参数2 :**  在谁里面查找
	3.  **参数3 :** 整数, 从什么位置开始查找, 如果省略该参数的话, 则默认从最开始的位置进行查找



**格式2 :** `patindex( 参数1, 参数2 )`

1. **参数1 :**  要查找什么内容, 可使用通配符, 也就是 **`%`**
2. **参数2 :**  在谁里面查找



> 以上两种格式, 如果找到你要查的字符串, 则返回那个字符串所在的位置, 返回值为整数;
>
> 如果没有找到你想要的字符串, 则返回 0



下面的例子 :

```mysql
/* 查找 那 字所在的位置 */
select charindex( '那','那是我们的照片' )

/* 查找 照 字所在的位置 从第4个位置开始查找*/
select charindex( '照','那是我们的照片', 4 )

/* 查找 那 字，并且该字处在字符串的起始位置 */
select patindex( '那%','那是我们的照片' )

/* 查找 我们 字，并且该字处在字符串的中间的某个位置 */
select patindex( '%我们%','那是我们的照片' )

/* 查找 照片 字，并且该字处在字符串的结束位置 */
select patindex( '%照片','那是我们的照片' )
```





---





#### 字符串拼接



**格式 :** stuff( `列名`, `开始位置`, `长度`, `替代的字符串` )



**作用 :** 用于删除指定字符串的长度, 并可以在指定的起点处插入另一组字符, 返回值是字符串型.



- 下面的例子,  将字符串 " 百色学院 " 中的学院删除: 

```mysql
select stuff('百色学院', 3, 4, '') newStr
```



- 下面的例子, 查询 student 里姓名叫望月的学生, 并将他的名字改为 "黄某人" :

```mysql
select *,stuff(name,1,2,'黄某人') 新名字
from student
where name = '望月'
```





---





#### 字符串截取



**格式1 :** substring( `string`, `startIndex`, `length` );

	1. `string`  源字符串
	2. `startIndex`  从哪个位置开始
	3. `length`  截取多少个字符

**格式2 :** left( `string`, `length` );

**格式3:** right( `string`, `length` );





**作用 :** 对字符串里的某个部分进行截取, 并将截取到的内容返回



> substring :  从指定位置开始, 截取多少个字符串
>
> left :  从做左边开始, 截取多少个字符串
>
> right :  从右边开始, 截取多少个字符串 





- 下面的例子, 将 " 百色学院黄某人 " 里的 " 学院 " 给截取出来 :

```mysql
select substring('百色学院黄某人', 3, 4)
```



- 下面的例子, 查找 student 里名字叫 " 黄某人 " 的学生, 并将他名字中的 " 某 " 字截取出来 :

```mysql
select substring(name, 2, 1)
from student
where name = '黄某人'
```



- 下面的例子, 分别使用 left 和 right 对 字符串 " 百色学院 " 进行截取2位字符 :

```mysql
select left('百色学院', 2)
select right('百色学院', 2)
```





---





#### 字符串去空格



**格式1 :** `ltrim ( string )`

**格式2 :** `rtrim( string )`



**作用如下 :**

- `ltrim ` 去除字符串左边的空格
- `rtrim` 去除字符串右边的空格



> SQL Server 里无法对字符串中间的空格进行去除, 只能去除左边或去除右边





- 下面的例子, 去除字符串 "    this  is  a  book      " 左边的空格 :

```mysql
select ltrim('    this  is  a  book      ')
```



- 下面的例子, 去除字符串 "    this  is  a  book      " 右边的空格 :

```mysql
select rtrim('    this  is  a  book      ')
```



- 下面的例子, 去除字符串 "    this  is  a  book      " 两边的空格 :

```mysql
select ltrim( rtrim('    this  is  a  book      '))
```





---





#### 大小写转换



**格式1 :** `upper( string )`

**格式2 :** `lower( string  )`



作用如下: 

1. `upper` 小写转大写
2. `lower` 大写转小写



> 大小写转换的函数只针对英文字母, 不会对中文造成任何影响



- 下面的例子, 将字符串 "abcd" 转为大写 :

```mysql
select upper('abcd')
```



- 下面的例子, 将字符串 "ABCD" 转为小写 :

```mysql
select lower('ABCD')
```



- 下面的例子, 将 student 表里所有的英文名字都转为小写 : 

```mysql
select lower(name) from student
```





---





#### 字符串替换



**格式 :** `replace( 源字符串, 替换谁, 换成谁 )`



- 下面的例子, 将字符串 " 黄某人 "  中的 " 黄 " 替换为 " 林 " :

```mysql
select replace('黄某人', '黄', '林')
```





---





#### 字符串重复



**格式 :** `replicate( 要重复的字符串,  重复的次数 )`



下面的例子,  将字符串 "abc" 重复3次 :

```mysql
select replicate('abc', 3)

/* abcabcabc */
```





---





#### 生成空格



**格式 :** `space( 生成多少个空格 )`



下面的例子, 在字符串 "百色"  与  "学院"  中间空5个空格 :

```mysql
select '百色' + space(5) + '学院'

/* 百色     学院 */
```





---





#### 字符串反转



**格式 :**  `reverse( 要反转的字符串 )`



下面的例子, 对字符串 " 我是黄某人 "  进行反转 :

```mysql
select reverse('我是黄某人')

/* 人某黄是我 */
```





---





#### 类型转换



**格式 :**  `cast`( 源数据  `as`  转成什么类型 )



- 下面的例子, 将 整数类型 123 转为 字符型 :

```mysql
select cast(123 as varchar(10) )
```



- 下面的例子, 将 字符串类型 "20190708" 转为 日期类型 :

```mysql
select cast('20190708' as datetime)
```



- 下面的例子, 将 student 表里每个学生的成绩变为两位小数的浮点形式 :

```mysql
select cast(score as decimal(15,2))
```





---





#### 空值处理



**格式 :** `isnull( 检测的值, 替换的文本 );`



**作用:** 会检查传入的值是否为null, 如果null, 则使用准备好的文本来进行替换;



下面的例子, 将 student 里所有name字段为 null的替换为 " 未填写姓名 " :

```mysql
select name , isnull(name, '未填写名字') from student
```







---





#### 条件判断 -- case



**格式1( case简单函数 )如下 :**

```mysql
case 字段 
	when '值'
		then '满足条件要输出的值'
	when '值'
		then '满足条件要输出的值'
	else '其他'
end
```



**格式2( case搜索函数 )如下 :**

```mysql
case 
	when '值' > 或 = 或 < '值'
		then '满足条件要输出的值'
	when '值' > 或 = 或 < '值'
		then '满足条件要输出的值'
	else '其他'
end
```



> 如果作为条件的值是一个定值, 则使用简单函数
>
> 如果作为条件的值是一个范围值, 则使用搜索函数





- 格式1示例, 查询 student 里所有的学生, 并根据性别的不同, 新增一个英文性别字段 :

```mysql
select
    *,
    case sex
        when '男'
            then 'man'
        when '女'
            then 'woman'
    end
from student
```



- 格式2示例, 查询 student 里所有学生的成绩, 并根据成绩进行评优 :

```mysql
select
    *,
    case
        when score >= 90
            then '优秀'
        when score >= 80 and score < 90
            then '良好'
        when score >= 60 and score < 80
            then '合格'
        else '不合格'
    end 评优等级
from student
```





---





#### 变量声明



**格式：**`declare`  `@变量名`  `变量类型`；

> 一次性声明多个变量的话，可用逗号隔开





---





#### 变量赋值



**格式：**`set`  `@变量名`  =  `值`；



---





#### 打印信息



**格式：**`print`  ' 要输出的信息 '



> print 只能显示字符型数据，注意我这里说的是 **显示**，如果是其他类型的数据，则需要使用cast进行类型转换





---





#### 语句块



格式如下：

```mysql
begin
	你的SQL语句
	···
	···
end
```



**作用：**将你的多条SQL语句当成一个整体，这样有时候可以保证查询的顺序问题





---





#### 