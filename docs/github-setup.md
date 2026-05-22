# GitHub Setup

在專案根目錄執行：

```bash
cd "C:\Users\lydie\My gitHub\whack-a-mole-product\whack-a-mole-product"
git init
git add .
git commit -m "Initial product release: Whack-a-Mole Garden Rush"
git branch -M main
```

如果 GitHub repo 尚未建立，使用 GitHub CLI：

```bash
gh repo create whack-a-mole-product --public --source=. --remote=origin --push
```

如果 repo 已存在：

```bash
git remote add origin https://github.com/lydie1976/whack-a-mole-product.git
git push -u origin main
```

CI 會在 push 與 pull request 執行：

- `npm install`
- `npm run typecheck`
- `npm run build`
