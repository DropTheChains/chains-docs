
- Window 11
- Debian13
- Go1.26

```golang
package main

  

import (

    "fmt"

    "time"

)

  

// worker 模拟一个工作协程，从通道接收任务并处理

// jobs <-chan int 表示 jobs 是一个只读通道，worker 只能从中接收数据

// results chan<- int 表示 results 是一个只写通道，worker 只能向其中发送数据

func worker(id int, jobs <-chan int, results chan<- int) {

    for j := range jobs {

        fmt.Printf("worker %d 开始处理任务 %d\n", id, j)

        time.Sleep(time.Second) // 模拟耗时操作

        results <- j * 2        // 将处理结果发送到 results 通道

        fmt.Printf("worker %d 完成任务 %d\n", id, j)

    }

}

  

func main() {

    const numJobs = 5

    jobs := make(chan int, numJobs)    // 创建带缓冲的任务通道  chan int 双向通道 接受读取int消息

    results := make(chan int, numJobs) // 创建带缓冲的结果通道

  

    // 启动 3 个 worker goroutine

    for w := 1; w <= 3; w++ {

        go worker(w, jobs, results) // 传入worker id用于记录，jobs、results只读和只写通道

    }

  

    // 发送 5 个任务到 jobs 通道

    for j := 1; j <= numJobs; j++ {

        jobs <- j

    }

    close(jobs) // 关闭通道，通知 worker 不会再有新任务

  

    // 收集所有处理结果

    for a := 1; a <= numJobs; a++ {

        fmt.Printf("结果: %d\n", <-results)

    }

}
```

在Windows终端执行命令

```
$env:CGO_ENABLED="0"
$env:GOOS="linux"
$env:GOARCH="amd64"
go build -o app-linux .
```

在Linux Debian中执行二进制文件

![](upload/Pasted%20image%2020260823145841.png)



