#!/bin/sh
#################### 文件中输入 #########################################

if [ ! -n "$1" ]; then
  echo "Please enter the file path and file name"
  exit 1
else
 inputfilepath=$1
fi

#current_local_branch=$(git branch | awk '/\*/ { print $2; }')
#all_remote_branches=$(git branch --remotes | sed 's/HEAD -> master//g')
#current_dir=$(pwd)
#repo_dir=$(git rev-parse --show-toplevel)
all_remote_branches=( "origin/components" )

consoleWLLP(){
        PROJECT=$(basename "$PWD")
        for remote_branch in ${all_remote_branches[@]}; do
            printf "$remote_branch \n"
            printf "Gitlab上的${PROJECT}项目${remote_branch}分支的成员数量、提交次数、代码行数信息统计开始...\n"

            printf "\n1. 项目成员数量："; git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --pretty='%aN' | sort -u | wc -l

            printf "\n\n2. 按用户名统计代码提交次数：\n\n"
            printf "%10s  %s\n" "次数" "用户名"
            git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --pretty='%aN' | sort | uniq -c | sort -k1 -n -r
            printf "\n%10s" "合计";
            printf "\n%5s" ""; git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --oneline | wc -l

            printf "\n3. 按用户名统计代码提交行数：\n\n"
            printf "%28s%20s%20s%20s\n" "用户名" "总行数" "添加行数" "删除行数"
            git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --format='%aN' | sort -u -r | while read name; do printf "%25s" "$name"; \
            git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --author="$name" --pretty=tformat: --numstat | \
            awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "%15s %15s %15s \n", loc, add, subs }' \
            -; done

            printf "\n%25s   " "总计：";  git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --pretty=tformat: --numstat | \
            awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "%15s %15s %15s \n", loc, add, subs }'

            echo ""
        done
}


consoleWLLP inputfilepath all_remote_branches
#################### 文件中输入 #########################################

execWLLP(){

        PROJECT=$(basename "$PWD")
        for remote_branch in ${all_remote_branches[@]}; do
            printf "$remote_branch \n"
    		printf "Gitlab上的$PROJECT项目${remote_branch}分支的成员数量、提交次数、代码行数信息统计开始...\n" >> ${inputfilepath}

    		printf "\n1. 项目成员数量：" >> ${inputfilepath} ; git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --pretty='%aN' | sort -u | wc -l >> ${inputfilepath}

    		printf "\n\n2. 按用户名统计代码提交次数：\n\n" >> ${inputfilepath}
    		printf "%10s  %s\n" "次数" "用户名" >> ${inputfilepath}
    		git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --pretty='%aN' | sort | uniq -c | sort -k1 -n -r >> ${inputfilepath} ;
    		printf "\n%10s" "合计:"  >> ${inputfilepath} ;
    		printf "\n%5s" ""; git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --oneline | wc -l >> ${inputfilepath}

    		printf "\n3. 按用户名统计代码提交行数：\n\n" >> ${inputfilepath}
    		printf "%28s%20s%20s%20s\n" "用户名" "总行数" "添加行数" "删除行数"  >> ${inputfilepath};
    		git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --format='%aN' | sort -u -r | while read name; do printf "%25s" "$name" >> ${inputfilepath} ; \
    		git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --author="$name" --pretty=tformat: --numstat | \
    		awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "%15s %15s %15s \n", loc, add, subs  >> "'"$inputfilepath"'" }' \
    		-; done

    		printf "\n%27s   " "总计：" >> ${inputfilepath} ; git log $remote_branch --since="2023-06-01 00:00:00" --until="2023-08-30 23:59:59" --pretty=tformat: --numstat | \
    		awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "%15s %15s %15s \n", loc, add, subs >> "'"$inputfilepath"'" }'

    		# sleep 5s

    		echo " "  >> ${inputfilepath};
    		echo "Gitlab上的${PROJECT}项目${remote_branch}分支的成员数量、提交次数、代码行数信息统计已完成...\n"  >> ${inputfilepath} ;
        done

         printf "Gitlab上的${PROJECT}项目全部分支的成员数量、提交次数、代码行数信息统计已完成...\n"  ;
}

trap 'onCtrlC' INT
function onCtrlC(){
        #捕获CTRL+C，当脚本被ctrl+c的形式终止时同时终止程序的后台进程
        kill -9 ${do_sth_pid} ${progress_pid}
        echo
        echo 'Ctrl+C exit 1'
        exit 1
}
do_sth(){
       execWLLP inputfilepath all_remote_branches
}
progress(){
        #进度条程序
        local main_pid=$1
        local length=30
        local ratio=1
        while [ "$(ps -p ${main_pid} | wc -l)" -ne "1" ] ; do
                mark='>'
                progress_bar=
                for i in $(seq 1 "${length}"); do
                        if [ "$i" -gt "${ratio}" ] ; then
                                mark='-'
                        fi
                        progress_bar="${progress_bar}${mark}"
                done
				printf "Progress: ${progress_bar}\r"
                ratio=$((ratio+1))
                #ratio=`expr ${ratio} + 1`
                if [ "${ratio}" -gt "${length}" ] ; then
                        ratio=1
                fi
                sleep 0.1
        done
}

do_sth &
do_sth_pid=$(jobs -p | tail -1)
progress "${do_sth_pid}" &
progress_pid=$(jobs -p | tail -1)
wait "${do_sth_pid}"
printf "Progress: done                \n"
