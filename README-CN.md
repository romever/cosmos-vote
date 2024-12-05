# Cosmos 治理 dApp

一个用于参与多个 Cosmos 链上治理提案的去中心化应用。用户可以使用其 Keplr 钱包查看和投票活跃的提案。

> 注意：本项目由 Cursor AI 协助生成。

[English](./README.md)

## 功能特点

- 多链支持（Cosmos Hub、Osmosis、Celestia、Dymension、Neutron）
- 实时提案跟踪
- 使用饼图可视化投票分布
- 多语言支持（中文/英文）
- Keplr 钱包集成
- 投票状态跟踪

## 环境要求

- Node.js (v16 或更高版本)
- Keplr 钱包浏览器扩展
- Yarn 或 npm

## 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/cosmos-vote.git
cd cosmos-vote
```

2. 安装依赖：

```bash
npm install
# 或
yarn
```

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 `http://localhost:5173`

## 使用说明

1. 使用连接按钮连接您的 Keplr 钱包
2. 从链选择器中选择所需的 Cosmos 链
3. 查看活跃的治理提案
4. 对提案进行投票（赞成/反对/弃权/否决）

## 技术栈

- React
- TypeScript
- Vite
- TailwindCSS
- CosmJS
- i18next

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。
