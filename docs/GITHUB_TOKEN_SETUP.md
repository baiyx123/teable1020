# GitHub Personal Access Token 设置指南

## 🔑 创建 GitHub Token

### 步骤 1：访问 GitHub Token 设置页面

**方式 A：直接访问**
```
https://github.com/settings/tokens/new
```

**方式 B：通过菜单**
1. 登录 GitHub
2. 点击右上角头像
3. Settings → Developer settings → Personal access tokens → Tokens (classic)
4. 点击 "Generate new token" → "Generate new token (classic)"

### 步骤 2：配置 Token

**Token 名称**：
```
Teable Development - 2025
```

**过期时间**：
- 建议选择 `90 days` 或 `No expiration`（永不过期）

**权限选择**（Scopes）：
至少勾选以下权限：
- ✅ `repo` - 完整的仓库访问权限
  - repo:status
  - repo_deployment
  - public_repo
  - repo:invite
  - security_events

**其他可选权限**：
- `workflow` - 如果需要操作 GitHub Actions
- `read:org` - 如果是组织仓库

### 步骤 3：生成并复制 Token

1. 滚动到底部，点击 **"Generate token"**
2. **立即复制生成的 Token**（只显示一次！）
3. Token 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 💾 配置 Git 使用 Token

### 方式 1：手动添加到凭据文件（推荐）

```bash
# 编辑凭据文件
nano ~/.git-credentials

# 添加以下行（替换 YOUR_TOKEN 为实际 token）：
https://baiyx123:YOUR_TOKEN@github.com
```

**完整示例**：
```
https://baiyunxing123:12345678aA@gitee.com
https://baiyx123:ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com
```

保存后立即生效，无需重启。

### 方式 2：使用 Git 命令添加

```bash
# Git 会在下次推送时提示输入用户名和密码
# 用户名: baiyx123
# 密码: 粘贴你的 Personal Access Token

git push origin main
```

### 方式 3：一键添加脚本

```bash
# 设置你的 token
TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 添加到凭据文件
echo "https://baiyx123:${TOKEN}@github.com" >> ~/.git-credentials

# 验证
cat ~/.git-credentials | grep github
```

---

## 🧪 测试配置

```bash
# 测试凭据是否有效
git ls-remote https://github.com/baiyx123/teable1020.git

# 如果成功，会显示：
# a1b2c3d4...  refs/heads/main
# e5f6g7h8...  refs/tags/v1.0.0

# 推送测试
cd /home/baiyx/teable1020
git push origin main
```

---

## 🔒 安全建议

### 1. Token 权限最小化
只授予必需的权限，不要全选

### 2. 定期更新 Token
建议每 90 天更新一次

### 3. 保护凭据文件
```bash
# 确保权限正确
chmod 600 ~/.git-credentials
```

### 4. 不要提交 Token
永远不要把 token 提交到代码仓库中

---

## 📋 快速操作清单

### 如果你现在就要推送：

**1. 创建 Token**
- 访问：https://github.com/settings/tokens/new
- 勾选 `repo` 权限
- 点击 "Generate token"
- 复制 token（ghp_开头的）

**2. 添加凭据**
```bash
nano ~/.git-credentials
# 添加：
# https://baiyx123:YOUR_TOKEN@github.com
```

**3. 推送**
```bash
cd /home/baiyx/teable1020
git push origin main
```

---

## ❓ 常见问题

### Q: Token 忘记了怎么办？
A: 无法查看已创建的 token，只能重新创建一个

### Q: Token 过期了怎么办？
A: 重新创建 token 并更新 ~/.git-credentials

### Q: 可以用密码代替 Token 吗？
A: 不可以，GitHub 已经禁用了密码认证，必须使用 Token

### Q: Token 和 SSH 哪个好？
A: 
- Token: 配置简单，但需要定期更新
- SSH: 一次配置永久使用，更安全（推荐）

---

## 🔄 替代方案：使用 SSH（推荐）

如果觉得 Token 麻烦，建议改用 SSH：

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "baiyunxing@vantrans.com.cn"

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 3. 添加到 GitHub
# 访问: https://github.com/settings/ssh/new
# 粘贴公钥

# 4. 修改仓库地址
cd /home/baiyx/teable1020
git remote set-url origin git@github.com:baiyx123/teable1020.git

# 5. 推送（不需要 token）
git push origin main
```

SSH 方式的优点：
- ✅ 一次配置，永久使用
- ✅ 不需要记住 token
- ✅ 更安全
- ✅ 不会过期


