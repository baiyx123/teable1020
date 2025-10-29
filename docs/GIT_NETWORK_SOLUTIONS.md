# Git 网络问题解决方案

## 📋 问题诊断

### 当前遇到的问题

```bash
fatal: unable to access 'https://github.com': Failed to connect to 127.0.0.1 port 7890
```

**原因分析**：
1. 系统 `~/.bashrc` 配置了代理：`export http_proxy="http://127.0.0.1:7890"`
2. 但 clash 代理服务已停止（apitable-dev.service 被禁用）
3. Git 继承了代理环境变量，但无法连接到代理
4. 直接连接 GitHub 在国内网络环境下也很困难

---

## ✅ 解决方案

### 方案 1：启动 Clash 代理（推荐）

#### 1.1 检查 Clash 状态

```bash
# 检查 clash 进程
ps aux | grep clash | grep -v grep

# 检查 apitable-dev 服务
systemctl status apitable-dev.service
```

#### 1.2 方式 A：重新启动 apitable-dev 服务

```bash
# 启动服务（包含 clash）
sudo systemctl start apitable-dev.service

# 验证 clash 是否运行
curl -I http://127.0.0.1:7890

# 测试 Git 连接
git ls-remote https://github.com/baiyx123/teable1020.git

# 推送
cd /home/baiyx/teable1020
git push origin main
```

#### 1.2 方式 B：单独启动 Clash

如果不想启动整个 apitable-dev 服务：

```bash
# 找到 clash 二进制文件
which clash-linux-amd64-v1.16.0
# 或
ls -la /usr/local/bin/clash*

# 启动 clash（替换为实际路径）
nohup /usr/local/bin/clash-linux-amd64-v1.16.0 -f /usr/local/bin/config.yaml > /tmp/clash.log 2>&1 &

# 验证
curl -I http://127.0.0.1:7890

# 推送
git push origin main
```

---

### 方案 2：临时禁用代理推送

#### 2.1 完全禁用环境变量

```bash
cd /home/baiyx/teable1020

# 方式 A：在新的 shell 中执行（推荐）
env -i HOME=$HOME USER=$USER PATH=$PATH TERM=$TERM \
  git push origin main

# 方式 B：临时取消代理变量
(unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY ALL_PROXY all_proxy && git push origin main)
```

#### 2.2 如果仍然失败

国内直连 GitHub 可能不稳定，可以尝试：

```bash
# 使用 GitHub 的 IPv4
git config --global http.version HTTP/1.1

# 增加超时时间
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 重试推送
git push origin main
```

---

### 方案 3：改用 SSH 协议（一劳永逸）

SSH 协议在某些网络环境下比 HTTPS 更稳定。

#### 3.1 生成 SSH 密钥（如果没有）

```bash
# 检查是否已有 SSH 密钥
ls -la ~/.ssh/id_*.pub

# 如果没有，生成新密钥
ssh-keygen -t ed25519 -C "baiyunxing@vantrans.com.cn"
# 或使用 RSA
ssh-keygen -t rsa -b 4096 -C "baiyunxing@vantrans.com.cn"

# 按提示操作，可以直接按回车使用默认路径
```

#### 3.2 添加 SSH 密钥到 GitHub

```bash
# 1. 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 或
cat ~/.ssh/id_rsa.pub

# 2. 访问 GitHub
#    https://github.com/settings/keys
#    点击 "New SSH key"
#    粘贴公钥内容并保存

# 3. 测试连接
ssh -T git@github.com
# 应该看到: Hi baiyx123! You've successfully authenticated...
```

#### 3.3 修改仓库远程地址为 SSH

```bash
cd /home/baiyx/teable1020

# 查看当前远程地址
git remote -v

# 修改为 SSH 地址
git remote set-url origin git@github.com:baiyx123/teable1020.git

# 验证
git remote -v

# 推送（不需要代理）
git push origin main
```

**优点**：
- ✅ 不需要代理
- ✅ 不需要输入密码
- ✅ 更安全
- ✅ 某些网络环境下更稳定

---

### 方案 4：配置 Git 使用其他代理

如果你有其他可用的代理服务：

```bash
# 临时使用其他代理
git -c http.proxy=socks5://127.0.0.1:1080 push origin main

# 或配置到仓库
git config http.proxy socks5://127.0.0.1:1080
git config https.proxy socks5://127.0.0.1:1080

# 推送
git push origin main

# 用完后取消
git config --unset http.proxy
git config --unset https.proxy
```

---

### 方案 5：使用 GitHub CLI（可选）

```bash
# 安装 GitHub CLI
sudo apt install gh

# 或使用 snap
sudo snap install gh

# 认证
gh auth login

# 推送（使用 gh 的认证）
git push origin main
```

---

## 🔧 永久解决方案

### 方案 A：修改 ~/.bashrc 的代理配置

让代理配置更智能：

```bash
# 编辑 ~/.bashrc
nano ~/.bashrc

# 找到这两行：
# export http_proxy="http://127.0.0.1:7890"
# export https_proxy="http://127.0.0.1:7890"

# 修改为条件设置（只在 clash 运行时设置）：
if curl -s --connect-timeout 1 http://127.0.0.1:7890 > /dev/null 2>&1; then
    export http_proxy="http://127.0.0.1:7890"
    export https_proxy="http://127.0.0.1:7890"
    echo "✓ 代理已启用 (127.0.0.1:7890)"
else
    unset http_proxy
    unset https_proxy
    echo "✗ 代理未运行，已禁用代理"
fi

# 保存后重新加载
source ~/.bashrc
```

### 方案 B：创建代理切换脚本

```bash
# 创建代理管理脚本
cat > ~/proxy.sh << 'EOF'
#!/bin/bash

case "$1" in
    on)
        export http_proxy="http://127.0.0.1:7890"
        export https_proxy="http://127.0.0.1:7890"
        echo "✓ 代理已启用"
        ;;
    off)
        unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
        echo "✓ 代理已禁用"
        ;;
    status)
        if [ -n "$http_proxy" ]; then
            echo "代理状态: 已启用 ($http_proxy)"
            if curl -s --connect-timeout 1 $http_proxy > /dev/null 2>&1; then
                echo "代理连接: ✓ 正常"
            else
                echo "代理连接: ✗ 无法连接"
            fi
        else
            echo "代理状态: 未启用"
        fi
        ;;
    *)
        echo "用法: source $0 {on|off|status}"
        ;;
esac
EOF

chmod +x ~/proxy.sh

# 使用方法：
source ~/proxy.sh on      # 启用代理
source ~/proxy.sh off     # 禁用代理
source ~/proxy.sh status  # 查看状态
```

---

## 🚀 快速解决当前推送问题

### 推荐流程（按优先级）：

#### 第1步：检查并启动 Clash

```bash
# 检查 clash 配置文件是否存在
ls -la /usr/local/bin/config.yaml

# 检查 clash 二进制文件
ls -la /usr/local/bin/clash*

# 如果文件都存在，启动 clash
nohup /usr/local/bin/clash-linux-amd64-v1.16.0 \
  -f /usr/local/bin/config.yaml \
  > /tmp/clash.log 2>&1 &

# 等待 2 秒
sleep 2

# 验证
curl -I http://127.0.0.1:7890
```

#### 第2步：推送到 GitHub

```bash
cd /home/baiyx/teable1020

# 确保代理可用
curl -I --proxy http://127.0.0.1:7890 https://github.com

# 推送
git push origin main
```

#### 第3步：推送完成后（可选）

```bash
# 停止 clash（如果不需要一直运行）
pkill clash

# 或保持运行以便后续使用
```

---

## 🔍 诊断命令合集

### 检查代理状态

```bash
# 查看环境变量
env | grep -i proxy

# 测试代理连接
curl -I http://127.0.0.1:7890

# 通过代理访问 GitHub
curl -I --proxy http://127.0.0.1:7890 https://github.com
```

### 检查 Git 配置

```bash
# 查看所有 Git 配置
git config --list | grep -i proxy

# 查看远程仓库地址
git remote -v

# 测试 GitHub 连接
git ls-remote https://github.com/baiyx123/teable1020.git
```

### 检查网络连接

```bash
# 测试 DNS 解析
nslookup github.com

# 测试连接
ping github.com -c 4

# 测试 HTTPS 连接
curl -I https://github.com

# 测试 SSH 连接
ssh -T git@github.com
```

---

## 📝 常见错误及解决

### 错误 1: Failed to connect to 127.0.0.1 port 7890

**原因**：代理未运行

**解决**：
```bash
# 启动 clash 或禁用代理
source ~/proxy.sh off
git push origin main
```

---

### 错误 2: could not read Username for 'https://github.com'

**原因**：需要 GitHub 认证但无法交互输入

**解决 A**：使用 credential helper
```bash
# 配置凭据存储
git config --global credential.helper store

# 手动创建凭据文件（如果有 token）
echo "https://YOUR_GITHUB_TOKEN@github.com" > ~/.git-credentials
```

**解决 B**：改用 SSH
```bash
git remote set-url origin git@github.com:baiyx123/teable1020.git
```

---

### 错误 3: GnuTLS recv error (-110)

**原因**：网络不稳定或超时

**解决**：
```bash
# 增加 buffer 和超时时间
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 重试
git push origin main
```

---

### 错误 4: SSL certificate problem

**原因**：SSL 证书验证问题（不推荐禁用）

**临时解决**：
```bash
# 仅用于测试（不安全）
GIT_SSL_NO_VERIFY=true git push origin main

# 更好的方法：更新证书
sudo apt update
sudo apt install ca-certificates
```

---

## 🎯 一键解决脚本

创建一个自动检测和修复的脚本：

```bash
#!/bin/bash
# git-push-helper.sh - Git 推送辅助脚本

echo "========================================="
echo "  Git 推送网络问题诊断和解决"
echo "========================================="
echo ""

# 1. 检查代理状态
echo "1. 检查代理配置..."
if [ -n "$http_proxy" ]; then
    echo "   代理已配置: $http_proxy"
    if curl -s --connect-timeout 2 "$http_proxy" > /dev/null 2>&1; then
        echo "   ✓ 代理可用"
        PROXY_OK=true
    else
        echo "   ✗ 代理不可用"
        PROXY_OK=false
    fi
else
    echo "   未配置代理"
    PROXY_OK=false
fi
echo ""

# 2. 检查 GitHub 连接
echo "2. 检查 GitHub 连接..."
if timeout 5 curl -I https://github.com > /dev/null 2>&1; then
    echo "   ✓ 可以直连 GitHub"
    GITHUB_OK=true
else
    echo "   ✗ 无法直连 GitHub"
    GITHUB_OK=false
fi
echo ""

# 3. 决定策略
echo "3. 选择推送策略..."
if [ "$PROXY_OK" = true ]; then
    echo "   → 使用代理推送"
    git push origin main
elif [ "$GITHUB_OK" = true ]; then
    echo "   → 禁用代理，直连推送"
    (unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY && git push origin main)
else
    echo "   ⚠️  需要手动解决网络问题"
    echo ""
    echo "   建议："
    echo "   1. 启动 clash 代理"
    echo "   2. 或改用 SSH 协议"
    echo "   3. 或使用其他网络环境"
    exit 1
fi
```

**使用方法**：
```bash
chmod +x ~/git-push-helper.sh
cd /home/baiyx/teable1020
~/git-push-helper.sh
```

---

## 💡 最佳实践建议

### 建议 1：使用 SSH 协议（一次配置，永久使用）

**优点**：
- ✅ 不需要代理
- ✅ 不需要每次输入密码
- ✅ 更安全
- ✅ 在某些网络环境下更稳定

**配置步骤**：

```bash
# 1. 生成 SSH 密钥（如果没有）
ssh-keygen -t ed25519 -C "baiyunxing@vantrans.com.cn"

# 2. 添加到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 4. 添加到 GitHub
#    访问: https://github.com/settings/ssh/new
#    标题: Teable Development
#    粘贴公钥内容

# 5. 测试连接
ssh -T git@github.com

# 6. 修改仓库地址
cd /home/baiyx/teable1020
git remote set-url origin git@github.com:baiyx123/teable1020.git

# 7. 推送
git push origin main
```

---

### 建议 2：智能代理配置

修改 `~/.bashrc` 为智能代理：

```bash
# 编辑 ~/.bashrc
nano ~/.bashrc

# 找到代理配置行，替换为：
# 智能代理配置 - 只在 clash 运行时启用
function enable_proxy() {
    export http_proxy="http://127.0.0.1:7890"
    export https_proxy="http://127.0.0.1:7890"
    export HTTP_PROXY="http://127.0.0.1:7890"
    export HTTPS_PROXY="http://127.0.0.1:7890"
    export ALL_PROXY="socks5://127.0.0.1:7891"
    echo "✓ 代理已启用"
}

function disable_proxy() {
    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY ALL_PROXY all_proxy
    echo "✓ 代理已禁用"
}

# 别名简化使用
alias proxy-on='enable_proxy'
alias proxy-off='disable_proxy'
alias proxy-status='env | grep -i proxy'

# 可选：自动检测 clash 并启用代理
if curl -s --connect-timeout 1 http://127.0.0.1:7890 > /dev/null 2>&1; then
    enable_proxy
fi
```

**使用方法**：
```bash
source ~/.bashrc

proxy-on      # 启用代理
proxy-off     # 禁用代理
proxy-status  # 查看状态

# Git 推送前
proxy-on
git push origin main
```

---

## 🎯 针对当前问题的推荐方案

### 立即可用的解决方案（按优先级）：

#### ✅ 方案 1：启动 Clash（最快）

```bash
# 1. 启动 apitable-dev 服务（包含 clash）
sudo systemctl start apitable-dev.service

# 2. 等待 2 秒
sleep 2

# 3. 验证
curl -I http://127.0.0.1:7890

# 4. 推送
cd /home/baiyx/teable1020
git push origin main

# 5. 推送完成后停止（可选）
sudo systemctl stop apitable-dev.service
```

#### ✅ 方案 2：改用 SSH（一劳永逸）

```bash
# 1. 检查 SSH 密钥
ls ~/.ssh/id_*.pub

# 2. 如果有密钥，直接修改远程地址
cd /home/baiyx/teable1020
git remote set-url origin git@github.com:baiyx123/teable1020.git

# 3. 测试连接
ssh -T git@github.com

# 4. 推送
git push origin main
```

**如果没有 SSH 密钥**，按照上面"建议 1"的步骤配置。

---

## 📱 快速命令参考

```bash
# === 检查系列 ===
env | grep proxy              # 查看代理环境变量
ps aux | grep clash           # 查看 clash 进程
curl -I http://127.0.0.1:7890 # 测试代理
git remote -v                 # 查看远程仓库

# === 启动 Clash ===
sudo systemctl start apitable-dev.service    # 启动服务
# 或
nohup /usr/local/bin/clash-linux-amd64-v1.16.0 -f /usr/local/bin/config.yaml &

# === 推送 Git ===
# 方式1: 使用代理
git push origin main

# 方式2: 不使用代理
(unset http_proxy https_proxy && git push origin main)

# 方式3: 使用 SSH
git remote set-url origin git@github.com:baiyx123/teable1020.git
git push origin main

# === 停止 Clash ===
pkill clash
sudo systemctl stop apitable-dev.service
```

---

## 🆘 紧急备用方案

如果所有方法都不行，可以：

### 1. 使用移动热点

```bash
# 连接手机热点后
git push origin main
```

### 2. 导出补丁文件

```bash
# 生成补丁文件
git format-patch origin/main

# 将 *.patch 文件复制到有网络的环境
# 在有网络的环境应用补丁：
git am *.patch
git push origin main
```

### 3. 打包仓库

```bash
# 打包整个仓库
cd /home/baiyx
tar -czf teable1020-backup.tar.gz teable1020/

# 在有网络的环境解压并推送
tar -xzf teable1020-backup.tar.gz
cd teable1020
git push origin main
```

---

## ✨ 推荐的最终配置

综合考虑安全性、便利性和稳定性：

```bash
# 1. 使用 SSH 协议访问 GitHub（推荐）
git remote set-url origin git@github.com:baiyx123/teable1020.git

# 2. 智能代理配置（修改 ~/.bashrc）
#    只在代理可用时启用

# 3. 创建代理管理脚本
#    方便快速切换

# 4. Git 优化配置
git config --global http.postBuffer 524288000
git config --global core.compression 0
```

这样配置后：
- Git 推送不依赖代理（使用 SSH）
- 其他应用可以根据需要启用/禁用代理
- 系统更加灵活和稳定

---

**最后**：如果你只是想快速推送，**最简单的方法是启动 apitable-dev 服务**（它会自动启动 clash），推送完成后再停止。


