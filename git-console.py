#!/usr/bin/env python3

# 执行命令 ：python  git-console.py  30    ,后面的 30 为天数，统计天数 ，为数字 ，不传默认为 0 
import os
import time
import json
import sys

argvs=sys.argv
#查询过去多少天的凌晨0点到现在的代码
tianshu=0
print(len(argvs))

if len(argvs)>1:
    tianshu=int(argvs[1])
else:
    tianshu=0    
    
print("查询天数",tianshu)    

localtime = time.localtime(time.time())
print ("本地时间为 :", localtime)


 
tianshu_tms = tianshu*24*60*60
tianshu_tms_name = (tianshu+30)*24*60*60

# 2023-12-25T02:13:42PST+0800
since_time =time.strftime("%Y-%m-%dT00:00:00%z", time.localtime(time.time() - tianshu_tms))
since_time_name =time.strftime("%Y-%m-%dT00:00:00%z", time.localtime(time.time() - tianshu_tms_name))
# 2023-12-25T02:13:42PST+0800
until_time = time.strftime("%Y-%m-%dT%H:%M:%S%z", time.localtime())

# print('time.time()',time.time())
# print('tianshu_tms',tianshu_tms)
print('since_time',since_time)
print('until_time',until_time)

branch=os.popen("git symbolic-ref --short HEAD").read()


print( 'branch: ', branch )



#cmd1 = 'git log --format=\'%aN\' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }\' -; done'
#cmd1 = "git log --format=\'%aN\' | sort -u"
cmd1 = "git log --since="+since_time_name+" --until="+ until_time+"  --format=%aN "



print('cmd1---------', cmd1)
fd = os.popen(cmd1)

# print('cmd1---------', fd)
# 读取输出
result = fd.read()
print('result---------', result)
names= result.splitlines(False)


names=set(names)
print(names)
print( len(names))


result_dict1 = {  }


def resolve_single(str1,name):
 arr=str(str1).split("\t")
# print( arr[0],arr[1])
 add=0
 subs=0
 if arr[0]=="-":
   add=0
 else:
   add=  int(arr[0])
 if arr[1]=="-":
   subs=0
 else:
   subs=  int(arr[1])
#  print('结果 arr0: {0},arr1: {1}, add:{2} ,subs:{3}。'.format(  arr[0],arr[1],add,subs))
 result_name_obj["add_total"] += add
 result_name_obj["subs_total"] += subs






def xunhuan_dan_ren_jieguo(arr,result_name_obj):
  for item in arr:
    resolve_single(item,result_name_obj)


def has_key(d, key):
    return key in d


def strl30(str1,len=30):
  # return str(str1).center(30)
  return str(str1).ljust(len)
  # return str(str1).rjust(30)



for name in names:
  print(name)
  if not has_key(result_dict1,name):
    result_dict1[name]={'add_total': 0,  'subs_total':0,'name':name}
  cmd2="git log --since="+since_time+" --until="+ until_time+"   --author="+name+" --pretty=tformat: --numstat  "
  rs2=os.popen(cmd2)
  result2=rs2.read().splitlines(False)
  print(len(result2))
  result_name_obj=result_dict1[name]
  xunhuan_dan_ren_jieguo(result2,result_name_obj)


print("result_dict1",result_dict1)
print("result_dict1",result_dict1.values())


# 打开文件
file_open = open("git-console.txt", 'w', encoding='utf-8')


def print_and_write(str1):
  print(str1)
  file_open.write(str1+"\n")


print_and_write('')
print_and_write('')
print_and_write('统计文件路径：./git-console.txt')
print_and_write('统计分支为：HEAD/'+branch[0:-1])
print_and_write('统计完整天数：'+ str(tianshu))
print_and_write('统计开始时间：'+since_time)
print_and_write('统计截止时间：'+until_time)

print_and_write('')
print_and_write('')
strf1='{0}\t{1}\t{2}\t{3} '
# print_and_write('人员 \t 增加行数 \t  删除行数 \t 逻辑行数 ' )
print_and_write(strf1.format( strl30('人员',28)  ,strl30('增加行数',26),strl30('删除行数',26),strl30('逻辑行数',26) ))
result_dict1_values = result_dict1.values()
# 升序
result_dict1_values = sorted(result_dict1_values, key=lambda x: x['add_total']) 
print_and_write('')
add_total=0
subs_total=0
for obj in result_dict1_values:
  add_total+=obj['add_total']
  subs_total+=obj['subs_total']
  # print_and_write('名字: {0},增加行数: {1}, 删除行数:{2} ,逻辑行数:{3}。'.format( obj['name'],obj['add_total'],obj['subs_total'], obj['add_total']-obj['subs_total']))
  # print_and_write(strf1.format( obj['name'],obj['add_total'],obj['subs_total'], obj['add_total']-obj['subs_total']))
  print_and_write(strf1.format( strl30(obj['name'])  ,strl30(obj['add_total']),strl30(obj['subs_total']),strl30(obj['add_total']-obj['subs_total']) ))
print_and_write('')
# print_and_write('总计: {0},增加行数: {1}, 删除行数:{2} ,逻辑行数:{3}。'.format(  '所有人',add_total, subs_total, add_total - subs_total ))
# print_and_write(strf1.format(  '所有人',add_total, subs_total, add_total - subs_total ))
# print_and_write(strf1.format(  '所有人',add_total, subs_total, add_total - subs_total ))

print_and_write( strf1.format( strl30('所有人',28)  ,strl30( add_total),strl30(subs_total),strl30( add_total - subs_total) ))

# strl30('')


# 关闭文件
file_open.close()


# 打开文件
file_open_2 = open("git-console.json", 'w', encoding='utf-8')


json_str = json.dumps(result_dict1)
file_open_2.write(json_str)